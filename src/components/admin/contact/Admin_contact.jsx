import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CONFIGS } from '../../../../config';
import { Table, Pagination } from 'react-bootstrap';
import './Admin_contact.css';

function Admin_contact() {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inquiriesPerPage] = useState(15);

  useEffect(() => {
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

    fetchInquiries();
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
