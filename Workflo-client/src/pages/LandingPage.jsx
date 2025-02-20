import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { saveUser } from "../api/utils";
import { Loader2 } from "lucide-react";

function LandingPage() {
  const { loading, setLoading, signInWithGoogle } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      await saveUser(result?.user);

      console.log("User logged in:", result.user);
      toast.success(`Logged in as ${result?.user?.displayName}`);

      // navigate
      navigate("/dashboard");
      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-screen">
      <h1 className="text-3xl font-bold">Welcome to Workflo</h1>
      <Button onClick={handleGoogleLogin} disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        Sign in with Google
      </Button>
    </div>
  );
}

export default LandingPage;
