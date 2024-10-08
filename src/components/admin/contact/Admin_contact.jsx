import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CONFIGS } from '../../../../config';
import { Table, Pagination } from 'react-bootstrap';
import './Admin_contact.css';
import { AiFillDelete } from 'react-icons/ai';

function Admin_contact() {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inquiriesPerPage] = useState(15);

  const fetchInquiries = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/getinquiry`);
      if (response.ok) {
        const data = await response.json();
        // Sort inquiries by _id to get the newest inquiries first
        const sortedInquiries = data.message.sort((a, b) => b._id.localeCompare(a._id));
        setInquiries(sortedInquiries);
      } else {
        const errorData = await response.json();
        toast.error('Failed to fetch inquiries: ' + errorData.message);
      }
    } catch (error) {
      toast.error('Failed to fetch inquiries. Please try again.');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchInquiries(); // Load inquiries when the component mounts
  }, []);
    const handleDownload = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/downloadInquiries`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'inquiries.xlsx');
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          console.error('Failed to download file');
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Pagination logic
    const indexOfLastInquiry = currentPage * inquiriesPerPage;
    const indexOfFirstInquiry = indexOfLastInquiry - inquiriesPerPage;
    const currentInquiries = inquiries.slice(indexOfFirstInquiry, indexOfLastInquiry);

    const totalPages = Math.ceil(inquiries.length / inquiriesPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    const handleDelete = async (_id) => {
      const confirmDelete = window.confirm("Are you sure you want to change the status of this inquiry?");

      if (confirmDelete) {
        try {
          const response = await fetch(`${CONFIGS.API_BASE_URL}/edit_status/${_id}`, {
            method: 'PUT', // or 'PATCH'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: true }), // Assuming the API expects a `status` field
          });
  
          const result = await response.json();
          console.log('Update Response:', result);
  
          if (response.ok) {
            toast.success("Inquiry status updated successfully.");
  
            // Update the status in the local state without refetching all data
            const updatedInquiries = inquiries.map(inquiry =>
              inquiry._id === _id ? { ...inquiry, status: true } : inquiry
            );
            setInquiries(updatedInquiries);
  
            // Fetch inquiries again to ensure the state is in sync with the backend
              fetchInquiries();
  
          } else {
            toast.error(`Failed to update inquiry status: ${result.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Error updating inquiry status:', error);
          toast.error("Failed to update the inquiry status.");
        }
      }
    };
    
    
    

  return (
    <div className="admin-contact-container text-center">
      <h1 className="admin-contact-title">Inquiries</h1>
      <button className="btn btn-dark mt-3 mb-3" onClick={handleDownload}>Download Excel</button>

      <Table striped bordered responsive hover className="inquiries-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company Name</th>
            <th>Phone Number</th>
            <th>Region</th>
            <th>Message</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {currentInquiries.map((inquiry, index) => (
            <tr key={index}>
              <td>{inquiry.name}</td>
              <td>{inquiry.company_name}</td>
              <td>{inquiry.user_number}</td>
              <td>{inquiry.region}</td>
              <td>{inquiry.message}</td>
              <td>
              {/* Delete icon with onClick handler */}
              <AiFillDelete 
                style={{ cursor: 'pointer', color: 'red' }} 
                onClick={() => handleDelete(inquiry._id)} 
              />
            </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Pagination controls */}
      <Pagination className="justify-content-center">
        {/* <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} /> */}
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        {/* <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} /> */}
      </Pagination>

    </div>
  );
}

export default Admin_contact;
