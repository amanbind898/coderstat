import Leaderboard from "../components/Leaderboard";

function ProfileTracker() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">Profile Tracker</h1>
      <p className="mt-4 text-lg">Coming soon...</p>
      <Leaderboard limit={10} />
    </div>
  );
}
export default ProfileTracker;