import { Button, Card, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import api from "../config/axiosConfig";
import toast from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';
import Loading from '../components/Loading';


function Login({ setIsLoading }) {
    const navigate = useNavigate();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { fetchUser, redirectLastPath } = useUser();
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "suryadi.hhb@gmail.com",
        password: "11111111"
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/login", formData);

            const user = response?.data?.response;

            await fetchUser();
            navigate('/users/profile');
            toast.success("Welcome Back " + user.name);

        } catch (error) {
            let errorMessage;
            if (error.response) {
                if (error.response.data && error.response.data.response) {
                    errorMessage = error.response.data.response;
                } else {
                    errorMessage = "An unexpected error occurred.";
                }
            } else if (error.request) {
                errorMessage = "No response from server. Please check your network connection.";
            } else {
                errorMessage = "An unexpected error occurred.";
            }

            toast.error(errorMessage);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        setTimeout(() => setIsPageLoading(false), 1500);

        const checkUser = async () => {
            try {
                const usersLogin = await fetchUser();
                if (usersLogin !== null) {
                    redirectLastPath(navigate);
                }
            } catch (error) {
                // console.log(error.code);
            }
        };

        checkUser();
    }, []);

    if (isPageLoading) {
        return <Loading />;
    }

    return (

        <div className="flex h-screen items-center justify-center bg-gray-100">
            <Card className="w-96 p-6">
                <h2 className="text-2xl font-bold text-center text-white">Login</h2>
                <p className="text-center text-gray-500 mb-4">
                    Welcome back! Please login to your account.
                </p>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <TextInput id="email" type="email" placeholder="you@example.com" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label htmlFor="password"> Password</Label>
                        <div className="relative">
                            <TextInput
                                id="password" name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                className="pr-12"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-5 flex items-center text-gray-800 hover:text-gray-500"
                            >
                                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" gradientDuoTone="purpleToBlue" className="w-full">
                        Login
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Belum punya akun?
                    <Link to="/register" className="text-blue-600 hover:underline">
                        &nbsp; Daftar
                    </Link>
                </p>
            </Card>
        </div>
    );
}

export default Login;
