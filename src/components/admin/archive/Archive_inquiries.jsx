import React, { useEffect, useState } from 'react'
import Archive_minibar from './Archive_minibar'
import { Pagination, Table } from 'react-bootstrap';
import { AiFillDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { CONFIGS } from '../../../../config';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';

function Archive_inquiries() {
    const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inquiriesPerPage] = useState(15);

  const fetchInquiries = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/getarchivedinquiry`);
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
            body: JSON.stringify({ status: false }), // Assuming the API expects a `status` field
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
    <>
    <Archive_minibar />
    <h1 className='text-center'>Archived inquiries</h1>
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
              <MdOutlineSettingsBackupRestore 
                style={{ cursor: 'pointer', color: 'red' }} 
                size={24}
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
    </>
  )
}

export default Archive_inquiries