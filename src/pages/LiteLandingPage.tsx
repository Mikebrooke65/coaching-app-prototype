import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { invitesApi } from '../lib/invites-api';
import type { InviteCodeValidation } from '../types/database';

export function LiteLandingPage() {
  const { code } = useParams<{ code: string }>();
  const [validation, setValidation] = useState<InviteCodeValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', consent: false });

  useEffect(() => {
    if (code) {
      invitesApi.validateInviteCode(code).then(v => {
        setValidation(v);
        setLoading(false);
      });
    }
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.consent) {
      setFormError('You must accept the privacy notice to continue.');
      return;
    }
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setFormError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await invitesApi.redeemInviteCode(code!, {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        privacy_consent: form.consent,
      });
      setSuccess(true);
    } catch (err: any) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Validating invite code...</p>
      </div>
    );
  }

  // Error states
  if (!validation?.valid) {
    const errorMessages: Record<string, { title: string; message: string }> = {
      expired: {
        title: 'Code Expired',
        message: 'This code has expired. Your coach/manager has been notified and can send you a new one.',
      },
      redeemed: {
        title: 'Already Used',
        message: 'This invite code has already been used.',
      },
      invalid: {
        title: 'Invalid Code',
        message: 'This invite code is not valid. Please check the link and try again.',
      },
    };
    const err = errorMessages[validation?.error || 'invalid'];

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2">{err.title}</h1>
          <p className="text-gray-600">{err.message}</p>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-xl font-bold mb-2">Welcome!</h1>
          <p className="text-gray-600 mb-4">
            You've been added to {validation.team?.age_group} {validation.team?.name}. You can now log in to the app.
          </p>
          <a href="/login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">Join {validation.team?.age_group} {validation.team?.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account to get started</p>
        </div>

        {formError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{formError}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="First name" value={form.first_name}
              onChange={e => setForm({ ...form, first_name: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm" required />
            <input type="text" placeholder="Last name" value={form.last_name}
              onChange={e => setForm({ ...form, last_name: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm" required />
          </div>
          <input type="email" placeholder="Email address" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm" required />
          <input type="password" placeholder="Create a password (min 6 characters)" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm" required minLength={6} />

          {/* Privacy consent */}
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-2">
            <p className="font-semibold text-gray-700">Privacy Notice</p>
            <p>By creating an account, you agree that:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Your name and role will be visible to coaches, managers, and admins of your team(s).</li>
              <li>If you are a caregiver, other caregivers linked to the same player will see your name and contact details.</li>
              <li>Your data is used solely for team coordination within this app.</li>
            </ul>
            <label className="flex items-start gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={form.consent}
                onChange={e => setForm({ ...form, consent: e.target.checked })}
                className="mt-0.5" />
              <span>I acknowledge and accept this privacy notice</span>
            </label>
          </div>

          <button type="submit" disabled={submitting || !form.consent}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
