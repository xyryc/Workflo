import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

function LandingPage() {
  const { user } = useContext(AuthContext);
  console.log(user);

  //   const navigate = useNavigate();

  //   const handleGoogleLogin = async () => {
  //     try {
  //       const result = await signInWithPopup(auth, provider);
  //       console.log("User logged in:", result.user);
  //       navigate("/dashboard"); // Redirect to dashboard after login
  //     } catch (error) {
  //       console.error("Login error:", error);
  //     }
  //   };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to Workflo</h1>
      <button
        // onClick={handleGoogleLogin}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default LandingPage;
