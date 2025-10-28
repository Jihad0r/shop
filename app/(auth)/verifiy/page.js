export default function VerifiedSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white shadow-lg rounded-2xl text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-3">Email Verified 🎉</h1>
        <p className="text-gray-700 mb-6">
          Your email has been successfully verified. You can now log in to your account.
        </p>
        <a
          href="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
