import { useState } from 'react'
import { useQueryClient,useMutation } from '@tanstack/react-query'
import { axiosInstance } from '../../lib/axios.js'
import {toast} from 'react-hot-toast'
import {Loader} from 'lucide-react'

const SignUpForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const queryClient = useQueryClient()

    const { mutate: signUpMutation, isLoading } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosInstance.post('/auth/signup', data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Account created successfully");
            queryClient.invalidateQueries({queryKey: ['authUser']});
        },
        onError: (err) => {
            toast.error(err.response.data.message || "Something went wrong");
        },
    })
    const handleSignUp = (e) => {
        e.preventDefault();
        //console.log(name, email, username, password);
        signUpMutation({ name, email, username, password })
    }

    return (
        <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
            <input
                type='text'
                placeholder='Full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='input input-bordered w-full'
                required
            />
            <input
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='input input-bordered w-full'
                required
            />
            <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='input input-bordered w-full'
                required
            />
            <input
                type='password'
                placeholder='Password (6+ characters)'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input input-bordered w-full'
                required
            />
            {/* <button className='btn btn-primary w-full text-white'>
                "Agree & Join"
            </button> */}
            <button type='submit' disabled={isLoading} className='btn btn-primary w-full text-white'>
                {isLoading ? <Loader className='size-5 animate-spin' /> : "Agree & Join"}
            </button>
        </form>
    );
};

export default SignUpForm