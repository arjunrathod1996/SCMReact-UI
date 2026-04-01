import React, { useState, ChangeEvent, FormEvent } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';

// 1. Define the shape of the form data
interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    role: string;
    city: string;
}

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();

    // 2. Initialize state with the interface
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        role: '',
        city: ''
    });

    // 3. Type the change event for input elements
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 4. Type the form submission event
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            // Assuming UserService.register expects (formData: RegisterFormData, token: string | null)
            await UserService.register(formData, token);

            // Clear the form fields
            setFormData({
                name: '',
                email: '',
                password: '',
                role: '',
                city: ''
            });

            alert('User registered successfully');
            navigate('/admin/user-management');

        } catch (error: any) {
            console.error('Error registering user:', error);
            alert(error.message || 'An error occurred while registering user');
        }
    };

    return (
        <div className="auth-container">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password"
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <input 
                        type="text" 
                        id="role"
                        name="role" 
                        value={formData.role} 
                        onChange={handleInputChange} 
                        placeholder="Enter your role" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City:</label>
                    <input 
                        type="text" 
                        id="city"
                        name="city" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        placeholder="Enter your city" 
                        required 
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegistrationPage;