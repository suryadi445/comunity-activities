import { useEffect, useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import api from "../config/axiosConfig";
import toast from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';
import Loading from '../components/Loading';

function Register({ setIsLoading }) {
    const navigate = useNavigate();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { fetchUser } = useUser();
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [formData, setFormData] = useState({
        name: "suryadi",
        email: "suryadi.hhb@gmail.com",
        password: "11111111",
        confirmPassword: "11111111",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post("/api/auth/register", formData);

            if (response.statusCode !== 201) {
                toast.success('Register successfully');
                await fetchUser();
                navigate('/');
            }
        } catch (error) {
            let errorMessage;
            if (error.response) {
                if (error.response.data && error.response.data.response) {
                    errorMessage = error.response.data.response[0];
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
                const response = await api.get("/api/user");
                if (response?.data?.response) {
                    navigate("/dashboard");
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
                <h2 className="text-2xl font-bold text-center text-white">
                    Register
                </h2>
                <p className="text-center text-gray-500 mb-4">
                    Welcome! Please register to your account.
                </p>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <TextInput id="name" name="name" type="text" placeholder="Your Name" value={formData.name} onChange={handleChange} />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <TextInput id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                    </div>

                    <div>
                        <Label htmlFor="password"> Password</Label>
                        <div className="relative">
                            <TextInput
                                id="password" name="password"
                                type={showPassword1 ? "text" : "password"}
                                placeholder="********"
                                className="pr-12"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword1(!showPassword1)}
                                className="absolute inset-y-0 right-5 flex items-center text-gray-800 hover:text-gray-500"
                            >
                                {showPassword1 ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <div className="relative">
                            <TextInput
                                id="confirm_password" name="confirm_password"
                                type={showPassword2 ? "text" : "password"}
                                placeholder="********"
                                className="pr-12"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword2(!showPassword2)}
                                className="absolute inset-y-0 right-5 flex items-center text-gray-800 hover:text-gray-500"
                            >
                                {showPassword2 ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" gradientDuoTone="purpleToBlue" className="w-full">
                        Register
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Sudah punya akun? &nbsp;
                    <Link to="/" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </Card>
        </div>
    );
}

export default Register;
