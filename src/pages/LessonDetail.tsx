import { useParams } from 'react-router';

export function LessonDetail() {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Lesson {id} details will appear here</p>
      </div>
    </div>
  );
}
