import { ArrowLeft, Clock, Users, CheckCircle, Play, X, Calendar } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState } from "react";

interface LessonDetailProps {
  lesson: {
    id: number;
    skill: string;
    name: string;
  };
  onBack: () => void;
}

export function LessonDetail({ lesson, onBack }: LessonDetailProps) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const [deliveryDate, setDeliveryDate] = useState<string>(today);
  const [isDateLocked, setIsDateLocked] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});

  const handleSubmitFeedback = (sessionKey: string) => {
    // In real app, this would save to storage with coach and team tags
    console.log('Submitting feedback for session:', sessionKey, {
      rating: ratings[sessionKey],
      feedback: feedback[sessionKey],
      deliveryDate: deliveryDate,
      // Would also include: coachId, teamId, lessonId, date, etc.
    });
    setOpenModal(null);
  };

  const handleOpenModal = (sessionKey: string) => {
    if (!isDateLocked) {
      alert('Please lock in the delivery date before marking sessions as delivered.');
      return;
    }
    setOpenModal(sessionKey);
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'Shooting':
        return 'bg-[#ea7800] text-white';
      case 'Passing':
        return 'bg-[#0091f3] text-white';
      case 'Attacking':
        return 'bg-green-500 text-white';
      case 'Defending':
        return 'bg-[#545859] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Mock data for the four session types - in real app, this would be loaded from storage
  const sessions = {
    technical: {
      name: "Warm-Up & Technical Fundamentals",
      duration: "15-20 mins",
      introduction: "Begin with a dynamic warm-up focusing on the basic techniques required for " + lesson.skill.toLowerCase() + ". This session prepares players physically and mentally.",
      instructions: "1. Start with 5 minutes of light jogging and dynamic stretching\n2. Set up cones in a grid pattern (10m x 10m)\n3. Players work in pairs, focusing on proper technique\n4. Coach demonstrates correct body position and movement\n5. Emphasize quality over speed in this phase\n6. Provide individual feedback on technique",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjB0cmFpbmluZyUyMGdyaWR8ZW58MXx8fHwxNzQwNjEyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      videoUrl: "https://example.com/technical-session.mp4", // Optional video
    },
    skillIntroduction: {
      name: "Skill Introduction: " + lesson.name,
      duration: "15-20 mins",
      introduction: "Introduce the core " + lesson.skill.toLowerCase() + " skill through demonstration and guided practice. Focus on breaking down the movement into key components.",
      instructions: "1. Gather players in a semi-circle for clear viewing\n2. Demonstrate the skill slowly, explaining each step\n3. Break down into 3-4 key teaching points\n4. Have players practice the movement without the ball first\n5. Progress to using the ball at walking pace\n6. Answer questions and address common mistakes\n7. Use positive reinforcement for correct execution",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBjb2FjaCUyMGRlbW9uc3RyYXRpb258ZW58MXx8fHwxNzQwNjEyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      videoUrl: null, // No video for this session
    },
    skillDevelopment: {
      name: "Progressive Skill Development",
      duration: "15-20 mins",
      introduction: "Build on the fundamentals with progressive drills that increase in complexity and pressure. Players develop confidence and competence through repetition.",
      instructions: "1. Set up 3 stations with different difficulty levels\n2. Station 1: Static practice - focus on technique (8 mins)\n3. Station 2: Moving practice - add movement patterns (10 mins)\n4. Station 3: Pressure practice - add passive/active defenders (12 mins)\n5. Rotate groups every drill segment\n6. Increase tempo as players gain confidence\n7. Provide water break between stations\n8. Give group feedback highlighting good examples",
      image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBkcmlsbCUyMHN0YXRpb25zfGVufDF8fHx8MTc0MDYxMjAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
      videoUrl: "https://example.com/skill-development.mp4",
    },
    game: {
      name: "Small-Sided Game Application",
      duration: "15-20 mins",
      introduction: "Apply the " + lesson.skill.toLowerCase() + " skill in a realistic game environment. Let players make decisions and solve problems independently.",
      instructions: "1. Create 2-3 small pitches (20m x 15m each) with small goals\n2. Organize teams of 4v4 or 5v5 depending on numbers\n3. Brief teams on the focus: encourage use of the trained skill\n4. Award bonus points when skill is used successfully\n5. Play 3 x 5-minute games with 2-minute breaks\n6. Rotate teams to ensure varied opposition\n7. Keep coaching minimal - let the game flow\n8. Observe and note key moments for debrief\n9. End with 5-minute cool-down and team discussion",
      image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzbWFsbCUyMHNpZGVkJTIwZ2FtZXxlbnwxfHx8fDE3NDA2MTIwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      videoUrl: "https://example.com/game-session.mp4",
    },
  };

  return (
    <div className="px-4 py-6 pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#22c55e] mb-4 hover:text-[#1ea84c] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <div className="border-l-8 border-[#22c55e] pl-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Lesson</h1>
          <p className="text-lg font-medium text-gray-800 mb-2">{lesson.name}</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSkillColor(lesson.skill)}`}>
            {lesson.skill}
          </span>
        </div>
      </div>

      {/* Delivery Date */}
      <div className="mb-4 bg-white rounded-2xl shadow-sm border-2 border-[#22c55e] overflow-hidden">
        <div className="p-4 bg-[#22c55e] border-b border-[#1ea84c]">
          <h2 className="font-bold text-lg text-white">Delivery Date</h2>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">
            Select the date this lesson was delivered. Lock the date before providing session feedback.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <Calendar className="w-5 h-5 text-[#22c55e]" />
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="flex-1 text-sm font-medium text-gray-900 bg-transparent focus:outline-none disabled:opacity-50"
                disabled={isDateLocked}
              />
            </div>
            <button
              onClick={() => setIsDateLocked(!isDateLocked)}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-sm ${
                isDateLocked
                  ? 'bg-[#22c55e] text-white hover:bg-[#1ea84c]'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {isDateLocked ? '🔒 Locked' : '🔓 Lock'}
            </button>
          </div>
          {!isDateLocked && (
            <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
              <span>⚠️</span>
              <span>Date must be locked before marking sessions as delivered</span>
            </p>
          )}
          {isDateLocked && (
            <p className="text-xs text-[#22c55e] mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Date locked - you can now mark sessions as delivered</span>
            </p>
          )}
        </div>
      </div>

      {/* Technical Block */}
      <div className="mb-4 bg-white rounded-2xl shadow-sm border-2 border-[#22c55e] overflow-hidden">
        <div className="p-4 bg-[#22c55e] border-b border-[#1ea84c]">
          <h2 className="font-bold text-lg text-white">Technical</h2>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base text-gray-900 mb-2">{sessions.technical.name}</h3>
          
          {/* Duration */}
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#22c55e]" />
            <span className="text-sm font-medium text-gray-700">{sessions.technical.duration}</span>
          </div>

          {/* Introduction */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#22c55e] mb-1">Introduction</p>
            <p className="text-sm text-gray-700 leading-relaxed">{sessions.technical.introduction}</p>
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#22c55e] mb-2">How to Run This Session</p>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{sessions.technical.instructions}</pre>
            </div>
          </div>

          {/* Setup Image */}
          <div className="mb-3">
            <p className="text-sm font-semibold text-[#22c55e] mb-2">Session Setup</p>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <ImageWithFallback
                src={sessions.technical.image}
                alt="Technical session setup"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Optional Video */}
          {sessions.technical.videoUrl && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#22c55e] mb-2">Video Tutorial</p>
              <button className="w-full bg-[#22c55e] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#1ea84c] transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Video Tutorial
              </button>
            </div>
          )}

          {/* Delivered Button */}
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => handleOpenModal('technical')}
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Skill Introduction Block */}
      <div className="mb-4 bg-white rounded-2xl shadow-sm border-2 border-[#22c55e] overflow-hidden">
        <div className="p-4 bg-[#22c55e] border-b border-[#1ea84c]">
          <h2 className="font-bold text-lg text-white">Skill Introduction</h2>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base text-gray-900 mb-2">{sessions.skillIntroduction.name}</h3>
          
          {/* Duration */}
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#22c55e]" />
            <span className="text-sm font-medium text-gray-700">{sessions.skillIntroduction.duration}</span>
          </div>

          {/* Introduction */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#22c55e] mb-1">Introduction</p>
            <p className="text-sm text-gray-700 leading-relaxed">{sessions.skillIntroduction.introduction}</p>
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#22c55e] mb-2">How to Run This Session</p>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{sessions.skillIntroduction.instructions}</pre>
            </div>
          </div>

          {/* Setup Image */}
          <div className="mb-3">
            <p className="text-sm font-semibold text-[#22c55e] mb-2">Session Setup</p>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <ImageWithFallback
                src={sessions.skillIntroduction.image}
                alt="Skill introduction session setup"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Optional Video */}
          {sessions.skillIntroduction.videoUrl && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#22c55e] mb-2">Video Tutorial</p>
              <button className="w-full bg-[#22c55e] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#1ea84c] transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Video Tutorial
              </button>
            </div>
          )}

          {/* Delivered Button */}
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => handleOpenModal('skillIntroduction')}
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Skill Development Block */}
      <div className="mb-4 bg-white rounded-2xl shadow-sm border-2 border-[#22c55e] overflow-hidden">
        <div className="p-4 bg-[#22c55e] border-b border-[#1ea84c]">
          <h2 className="font-bold text-lg text-white">Skill Development</h2>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base text-gray-900 mb-2">{sessions.skillDevelopment.name}</h3>
          
          {/* Duration */}
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#22c55e]" />
            <span className="text-sm font-medium text-gray-700">{sessions.skillDevelopment.duration}</span>
          </div>

          {/* Introduction */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#22c55e] mb-1">Introduction</p>
            <p className="text-sm text-gray-700 leading-relaxed">{sessions.skillDevelopment.introduction}</p>
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#22c55e] mb-2">How to Run This Session</p>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{sessions.skillDevelopment.instructions}</pre>
            </div>
          </div>

          {/* Setup Image */}
          <div className="mb-3">
            <p className="text-sm font-semibold text-[#22c55e] mb-2">Session Setup</p>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <ImageWithFallback
                src={sessions.skillDevelopment.image}
                alt="Skill development session setup"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Optional Video */}
          {sessions.skillDevelopment.videoUrl && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#22c55e] mb-2">Video Tutorial</p>
              <button className="w-full bg-[#22c55e] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#1ea84c] transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Video Tutorial
              </button>
            </div>
          )}

          {/* Delivered Button */}
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => handleOpenModal('skillDevelopment')}
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Game Block */}
      <div className="mb-4 bg-white rounded-2xl shadow-sm border-2 border-[#22c55e] overflow-hidden">
        <div className="p-4 bg-[#22c55e] border-b border-[#1ea84c]">
          <h2 className="font-bold text-lg text-white">Game</h2>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base text-gray-900 mb-2">{sessions.game.name}</h3>
          
          {/* Duration */}
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#22c55e]" />
            <span className="text-sm font-medium text-gray-700">{sessions.game.duration}</span>
          </div>

          {/* Introduction */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#22c55e] mb-1">Introduction</p>
            <p className="text-sm text-gray-700 leading-relaxed">{sessions.game.introduction}</p>
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#22c55e] mb-2">How to Run This Session</p>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{sessions.game.instructions}</pre>
            </div>
          </div>

          {/* Setup Image */}
          <div className="mb-3">
            <p className="text-sm font-semibold text-[#22c55e] mb-2">Session Setup</p>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <ImageWithFallback
                src={sessions.game.image}
                alt="Game session setup"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Optional Video */}
          {sessions.game.videoUrl && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#22c55e] mb-2">Video Tutorial</p>
              <button className="w-full bg-[#22c55e] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#1ea84c] transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Video Tutorial
              </button>
            </div>
          )}

          {/* Delivered Button */}
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => handleOpenModal('game')}
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#22c55e] p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">Session Feedback</h3>
              <button
                onClick={() => setOpenModal(null)}
                className="text-white hover:bg-[#1ea84c] rounded-full p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5">
              {/* Question */}
              <div className="mb-6">
                <h4 className="font-bold text-base text-gray-900 mb-1">How did it go?</h4>
                <p className="text-sm text-gray-600">Any thoughts on this session?</p>
              </div>

              {/* Likert Scale 1-5 */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Rate this session:</p>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setRatings({ ...ratings, [openModal]: rating })}
                      className={`flex-1 py-3 px-2 rounded-xl font-medium text-sm transition-all ${
                        ratings[openModal] === rating
                          ? 'bg-[#22c55e] text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Free Text Feedback */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Additional Comments (optional):
                </label>
                <textarea
                  value={feedback[openModal] || ''}
                  onChange={(e) => setFeedback({ ...feedback, [openModal]: e.target.value })}
                  placeholder="Share your thoughts about how the session went..."
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                  rows={4}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {(feedback[openModal] || '').length}/200
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setOpenModal(null)}
                  className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitFeedback(openModal)}
                  disabled={!ratings[openModal]}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                    ratings[openModal]
                      ? 'bg-[#22c55e] text-white hover:bg-[#1ea84c]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Feedback
                </button>
              </div>

              {/* Info Note */}
              <p className="text-xs text-gray-500 mt-4 text-center">
                This feedback will be saved with your coach profile and team information
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}