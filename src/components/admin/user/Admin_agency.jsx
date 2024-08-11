import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../store/Auth';
// import MiniNavbar from './MiniNavbar'; 
import { CONFIGS } from '../../../../config';
import './adminagency.css';
import MiniNavbar from './MiniNavabar';

function Admin_agency() {
    const [agencyForm, setAgencyForm] = useState({
        agency_name: '', owner: '', mobile_number: '', email: '', gstno: '', address: '', logo: null
    });

    const [agencies, setAgencies] = useState([]);

    const userAuthentication = useAuth();

    const fetchAgencies = async () => {
        try {
            const response = await fetch(`${CONFIGS.API_BASE_URL}/getagency`);
            const data = await response.json();
            setAgencies(data.message);
        } catch (error) {
            console.error('Error fetching agencies:', error);
        }
    };

    const handleAgencySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in agencyForm) {
            formData.append(key, agencyForm[key]);
        }
        formData.append('admin_id', userAuthentication.user._id);

        try {
            const response = await fetch(`${CONFIGS.API_BASE_URL}/addagency`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            alert('Agency added successfully');
            setAgencyForm({ agency_name: '', owner: '', mobile_number: '', email: '', gstno: '', address: '', logo: null });
            fetchAgencies();
        } catch (error) {
            console.error('Error adding agency:', error);
            alert(`Failed to add agency: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchAgencies();
    }, []);

    return (
        <div>
            <MiniNavbar />
            <div className="admin-agency-container">
                <h2 className="admin-agency-title">Add Agency</h2>
                <form className="admin-agency-form" onSubmit={handleAgencySubmit}>
                    <label className="admin-agency-label">
                        Agency Name
                        <input 
                            className="admin-agency-input" 
                            type="text" 
                            placeholder="Agency Name" 
                            value={agencyForm.agency_name} 
                            onChange={(e) => setAgencyForm({ ...agencyForm, agency_name: e.target.value })}
                        />
                    </label>
                    <label className="admin-agency-label">
                        Owner
                        <input 
                            className="admin-agency-input" 
                            type="text" 
                            placeholder="Owner" 
                            value={agencyForm.owner} 
                            onChange={(e) => setAgencyForm({ ...agencyForm, owner: e.target.value })}
                        />
                    </label>
                    <label className="admin-agency-label">
                        Mobile Number
                        <input 
                            className="admin-agency-input" 
                            type="text" 
                            placeholder="Mobile Number" 
                            value={agencyForm.mobile_number} 
                            onChange={(e) => setAgencyForm({ ...agencyForm, mobile_number: e.target.value })}
                        />
                    </label>
                    <label className="admin-agency-label">
                        Email
                        <input 
                            className="admin-agency-input" 
                            type="email" 
                            placeholder="Email" 
                            value={agencyForm.email} 
                            onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                        />
                    </label>
                    <label className="admin-agency-label">
                        GST No
                        <input 
                            className="admin-agency-input" 
                            type="text" 
                            placeholder="GST No" 
                            value={agencyForm.gstno} 
                            onChange={(e) => setAgencyForm({ ...agencyForm, gstno: e.target.value })}
                        />
                    </label>
                    <label className="admin-agency-label">
                        Address
                        <input 
                            className="admin-agency-input" 
                            type="text" 
                            placeholder="Address" 
                            value={agencyForm.address} 
                            onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })}
                        />
                    </label>
                    <label className="admin-agency-label">
                        Logo
                        <input 
                            className="admin-agency-input-file form-control p-2" 
                            type="file" 
                            onChange={(e) => setAgencyForm({ ...agencyForm, logo: e.target.files[0] })}
                        />
                    </label>
                    <button className="admin-agency-button" type="submit">Add Agency</button>
                </form>
            </div>
        </div>
    );
}

export default Admin_agency;
