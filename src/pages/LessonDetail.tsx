import { useParams, useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { DeliveryDateModal } from '../components/DeliveryDateModal';
import { SessionFeedbackModal } from '../components/SessionFeedbackModal';

interface Session {
  id: string;
  session_name: string;
  title: string;
  duration: number;
  description: string;
  organisation: string;
  equipment: string[];
  coaching_points: string[];
  steps: string[];
  key_objectives: string[];
  pitch_layout_description: string;
  diagram_url: string | null;
  video_url: string | null;
}

interface SessionDelivery {
  id: string;
  session_id: string;
  rating: number | null;
  feedback: string | null;
}

interface LessonDelivery {
  id: string;
  delivery_date: string;
  is_locked: boolean;
  team_id: string;
  team_name: string;
  session_deliveries: SessionDelivery[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  age_group: string;
  skill_category: string;
  level: string;
  total_duration: number;
  objectives: string[];
  coaching_focus: string[];
  sessions: Session[];
  delivery?: LessonDelivery;
}

export function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
    (location.state as any)?.teamId || null
  );
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSessionId, setFeedbackSessionId] = useState<string | null>(null);
  const [feedbackSessionTitle, setFeedbackSessionTitle] = useState('');

  useEffect(() => {
    fetchLesson();
  }, [id, selectedTeamId]);

  const fetchLesson = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch lesson basic info
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', id)
          .single();

        if (lessonError) throw lessonError;
        if (!lessonData) {
          setError('Lesson not found');
          return;
        }

        // Fetch all 4 sessions
        const sessionIds = [
          lessonData.session_1_id,
          lessonData.session_2_id,
          lessonData.session_3_id,
          lessonData.session_4_id,
        ].filter(Boolean);

        const { data: sessionsData, error: sessionsError} = await supabase
          .from('sessions')
          .select('*')
          .in('id', sessionIds);

        if (sessionsError) throw sessionsError;

        // Order sessions correctly (session_1, session_2, session_3, session_4)
        const orderedSessions = [
          sessionsData?.find(s => s.id === lessonData.session_1_id),
          sessionsData?.find(s => s.id === lessonData.session_2_id),
          sessionsData?.find(s => s.id === lessonData.session_3_id),
          sessionsData?.find(s => s.id === lessonData.session_4_id),
        ].filter(Boolean) as Session[];

        // Fetch delivery data if user has a selected team
        let deliveryData: LessonDelivery | undefined;
        if (user && selectedTeamId) {
          console.log('Fetching delivery for team:', selectedTeamId);
          
          // First, fetch the delivery record
          const { data: delivery, error: deliveryError } = await supabase
            .from('lesson_deliveries')
            .select('id, delivery_date, is_locked, team_id')
            .eq('lesson_id', id)
            .eq('team_id', selectedTeamId)
            .maybeSingle();

          console.log('Delivery query result:', { delivery, error: deliveryError });

          if (deliveryError) {
            console.error('Error fetching delivery:', deliveryError);
          } else if (delivery) {
            console.log('Delivery found:', delivery);
            
            // Fetch team name separately
            const { data: teamData } = await supabase
              .from('teams')
              .select('name')
              .eq('id', delivery.team_id)
              .single();

            console.log('Team data:', teamData);

            // Fetch session deliveries separately
            const { data: sessionDeliveries, error: sessionError } = await supabase
              .from('session_deliveries')
              .select('id, session_id, rating, feedback')
              .eq('lesson_delivery_id', delivery.id);

            console.log('Session deliveries:', { sessionDeliveries, error: sessionError });

            deliveryData = {
              id: delivery.id,
              delivery_date: delivery.delivery_date,
              is_locked: delivery.is_locked,
              team_id: delivery.team_id,
              team_name: teamData?.name || '',
              session_deliveries: sessionDeliveries || [],
            };
            console.log('Delivery data prepared:', deliveryData);
          } else {
            console.log('No delivery found for this team');
          }
        }

        setLesson({
          ...lessonData,
          sessions: orderedSessions,
          delivery: deliveryData,
        });
      } catch (error) {
        console.error('Error fetching lesson:', error);
        setError('Failed to load lesson');
      } finally {
        setIsLoading(false);
      }
    }

  const handleCreateDelivery = async (teamId: string, date: string) => {
    if (!id || !user || !lesson) return;

    try {
      if (lesson.delivery) {
        await supabase
          .from('lesson_deliveries')
          .update({ team_id: teamId, delivery_date: date })
          .eq('id', lesson.delivery.id);
      } else {
        const { data: delivery } = await supabase
          .from('lesson_deliveries')
          .insert({
            lesson_id: id,
            team_id: teamId,
            coach_id: user.id,
            delivery_date: date,
          })
          .select()
          .single();

        if (delivery) {
          const sessionDeliveries = lesson.sessions.map(session => ({
            lesson_delivery_id: delivery.id,
            session_id: session.id,
            delivered: false,
            rating: null,
            feedback: null,
          }));

          await supabase.from('session_deliveries').insert(sessionDeliveries);
        }
      }

      setShowDeliveryModal(false);
      setSelectedTeamId(teamId);
      await fetchLesson(); // Direct call
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save delivery');
      setShowDeliveryModal(false);
    }
  };

  const handleSaveFeedback = async (sessionDeliveryId: string, rating: number, feedback: string) => {
    try {
      const { error } = await supabase
        .from('session_deliveries')
        .update({
          rating,
          feedback,
          delivered: rating > 0,
          delivered_at: rating > 0 ? new Date().toISOString() : null,
        })
        .eq('id', sessionDeliveryId);

      if (error) throw error;

      // Refetch to update UI
      fetchLesson();
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }
  };

  const handleLockDelivery = async () => {
    if (!lesson?.delivery?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to lock this feedback? You won't be able to edit it after locking."
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('lesson_deliveries')
        .update({ is_locked: true })
        .eq('id', lesson.delivery.id);

      if (error) throw error;

      // Refetch to update UI
      fetchLesson();
    } catch (error) {
      console.error('Error locking delivery:', error);
      alert('Failed to lock feedback');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0091f3]"></div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Lesson not found'}
          </h2>
          <button
            onClick={() => navigate('/coaching')}
            className="text-[#0091f3] hover:underline"
          >
            Back to Coaching
          </button>
        </div>
      </div>
    );
  }

  const sessionTypeLabels = ['Warm-Up & Technical', 'Skill Introduction', 'Progressive Development', 'Game Application'];

  return (
    <div className="bg-gray-50 min-h-full pb-24">{/* Added pb-24 for bottom nav clearance */}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <button
            onClick={() => navigate('/coaching')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-3"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Coaching
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0091f3] text-white">
                  {lesson.age_group}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {lesson.level}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {lesson.total_duration} min
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#545859] text-white">
                  {lesson.skill_category}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                className={`w-6 h-6 ${isFavorite ? 'fill-[#ea7800] text-[#ea7800]' : 'text-gray-400'}`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </div>

          {lesson.description && (
            <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
          )}

          {/* Delivery Status */}
          {lesson.delivery ? (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Delivered: {new Date(lesson.delivery.delivery_date).toLocaleDateString()}
                </span>
                {lesson.delivery.is_locked ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    🔒 Locked
                  </span>
                ) : (
                  <button
                    onClick={handleLockDelivery}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  >
                    Lock Feedback
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowDeliveryModal(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Edit Delivery Date
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeliveryModal(true)}
              className="mb-4 px-4 py-2 bg-[#22c55e] text-white rounded-lg text-sm font-medium hover:bg-[#16a34a]"
            >
              Mark as Delivered
            </button>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>
            <button className="flex-1 flex items-center justify-center px-4 py-2 bg-[#0091f3] text-white rounded-lg text-sm font-medium hover:bg-[#0077cc]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <div className="p-4">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Learning Objectives</h2>
            <ul className="space-y-2">
              {lesson.objectives.map((objective, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Session Blocks */}
      <div className="p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Session Plan</h2>
        <div className="space-y-3">
          {lesson.sessions.map((session, index) => (
            <div key={session.id} className="bg-white rounded-lg shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0091f3] text-white flex items-center justify-center font-semibold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-xs text-gray-500">{session.duration} minutes • {sessionTypeLabels[index]}</p>
                    </div>
                  </div>
                </div>

                {/* Pitch Diagram */}
                {session.diagram_url && (
                  <div className="mb-3">
                    <img 
                      src={session.diagram_url} 
                      alt={`${session.title} pitch layout`}
                      className="w-full rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Organisation */}
                {session.organisation && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">How It Runs</h4>
                    <p className="text-sm text-gray-700">{session.organisation}</p>
                  </div>
                )}

                {/* Equipment */}
                {session.equipment && session.equipment.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Equipment</h4>
                    <div className="flex flex-wrap gap-1">
                      {session.equipment.map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coaching Points */}
                {session.coaching_points && session.coaching_points.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Coaching Points</h4>
                    <ul className="space-y-1">
                      {session.coaching_points.map((point, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <span className="text-[#0091f3] mr-2">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Steps */}
                {session.steps && session.steps.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Steps</h4>
                    <ol className="space-y-1">
                      {session.steps.map((step, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <span className="text-[#0091f3] mr-2 font-medium">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Key Objectives */}
                {session.key_objectives && session.key_objectives.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Player Learning Objectives</h4>
                    <ul className="space-y-1">
                      {session.key_objectives.map((objective, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <span className="text-green-500 mr-2">✓</span>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Session Feedback Button */}
                {lesson.delivery && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        const sessionDelivery = lesson.delivery!.session_deliveries.find(sd => sd.session_id === session.id);
                        if (sessionDelivery) {
                          // Store which session we're providing feedback for
                          setFeedbackSessionId(session.id);
                          setFeedbackSessionTitle(session.title);
                          setShowFeedbackModal(true);
                        }
                      }}
                      disabled={lesson.delivery.is_locked}
                      className="w-full px-4 py-2 bg-[#0091f3] text-white rounded-lg text-sm font-medium hover:bg-[#0077cc] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {lesson.delivery.session_deliveries.find(sd => sd.session_id === session.id)?.rating !== null ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Edit Feedback
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          Provide Feedback
                        </>
                      )}
                    </button>
                    {lesson.delivery.is_locked && (
                      <p className="text-xs text-gray-500 text-center mt-2">Feedback is locked</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      {lesson?.delivery && feedbackSessionId && (
        <SessionFeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setFeedbackSessionId(null);
            setFeedbackSessionTitle('');
          }}
          sessionTitle={feedbackSessionTitle}
          sessionDeliveryId={
            lesson.delivery.session_deliveries.find(sd => sd.session_id === feedbackSessionId)?.id || null
          }
          initialRating={
            lesson.delivery.session_deliveries.find(sd => sd.session_id === feedbackSessionId)?.rating || null
          }
          initialFeedback={
            lesson.delivery.session_deliveries.find(sd => sd.session_id === feedbackSessionId)?.feedback || null
          }
          isLocked={lesson.delivery.is_locked}
          onSave={handleSaveFeedback}
        />
      )}

      {/* Delivery Date Modal */}
      {user && (
        <DeliveryDateModal
          isOpen={showDeliveryModal}
          onClose={() => setShowDeliveryModal(false)}
          onConfirm={handleCreateDelivery}
          userId={user.id}
          existingDelivery={lesson?.delivery ? {
            teamId: lesson.delivery.team_id,
            date: lesson.delivery.delivery_date,
          } : undefined}
        />
      )}
    </div>
  );
}
