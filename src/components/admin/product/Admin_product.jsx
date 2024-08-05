// import React, { useEffect, useState } from 'react';
// import Table from 'react-bootstrap/Table';
// import { CONFIGS } from '../../../../config';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../store/Auth';
// import { Modal, Button } from 'react-bootstrap';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
// import './addproduct.css';
// import { MdDelete } from 'react-icons/md';
// import { GrDocumentUpdate } from 'react-icons/gr';

// function Admin_product() {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const { user, isLoggedIn } = useAuth();
//     const navigate = useNavigate();

//     const [showModal, setShowModal] = useState(false);
//     const [selectedProductId, setSelectedProductId] = useState(null);

//     const fetchProducts = async () => {
//         setLoading(true);

//         if (!isLoggedIn) {
//             navigate('/');
//         }

//         try {
//             const response = await fetch(`${CONFIGS.API_BASE_URL}/viewproducts`, {
//                 method: 'GET',
//             });

//             if (!response.ok) {
//                 console.log('No products');
//                 return;
//             }

//             const data = await response.json();
//             setProducts(data.message);
//         } catch (error) {
//             console.log('Error fetching products:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     const handleDelete = async () => {
//         try {
//             const response = await fetch(`${CONFIGS.API_BASE_URL}/deleteproduct/${selectedProductId}`, {
//                 method: 'DELETE',
//             });

//             if (response.ok) {
//                 setProducts(products.filter(product => product._id !== selectedProductId));
//                 setShowModal(false);
//             } else {
//                 console.error('Error deleting product');
//             }
//         } catch (error) {
//             console.error('Error deleting product:', error);
//         }
//     };

//     const openModal = (productId) => {
//         setSelectedProductId(productId);
//         setShowModal(true);
//     };

//     const closeModal = () => {
//         setShowModal(false);
//         setSelectedProductId(null);
//     };

//     return (
//         <div>
//             <button
//                 className='btn btn-success m-3'
//                 onClick={() => navigate('/admin/addproduct')}
//             >
//                 Add New Products
//             </button>
//             <h1>Our Products</h1>
//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Name</th>
//                         <th>Image</th>
//                         <th>Desc</th>
//                         <th>Price</th>
//                         <th>Package</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {products.map((product) => (
//                         <tr key={product._id}>
//                             <td>{product.name}</td>
//                             <td><img src={product.image} height={50} alt={product.name} /></td>
//                             <td>{product.desc}</td>
//                             <td>{product.price}</td>
//                             <td>{product.size}</td>
//                             <td className='actions-column'>
//                                 <Link to={`/admin/product/${product._id}/update`} className='btn btn-primary action-btn'>
//                                 <GrDocumentUpdate />

//                                 </Link>
//                                 <button
//                                     className='btn btn-danger action-btn'
//                                     onClick={() => openModal(product._id)}
//                                 >
//                                     <MdDelete />

//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//             <Modal show={showModal} onHide={closeModal}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Confirm Delete</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={closeModal}>
//                         Cancel
//                     </Button>
//                     <Button variant="danger" onClick={handleDelete}>
//                         Delete
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// }

// export default Admin_product;


import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { CONFIGS } from '../../../../config';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/Auth';
import { Modal, Button } from 'react-bootstrap';
import './addproduct.css';
import { MdDelete } from 'react-icons/md';
import { GrDocumentUpdate } from 'react-icons/gr';

function Admin_product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);

        if (!isLoggedIn) {
            navigate('/');
        }

        try {
            const response = await fetch(`${CONFIGS.API_BASE_URL}/viewproducts`, {
                method: 'GET',
            });

            if (!response.ok) {
                console.log('No products');
                return;
            }

            const data = await response.json();
            setProducts(data.message);
        } catch (error) {
            console.log('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async () => {
        try {
            const response = await fetch(`${CONFIGS.API_BASE_URL}/deleteproduct/${selectedProductId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProducts(products.filter(product => product._id !== selectedProductId));
                setShowModal(false);
            } else {
                console.error('Error deleting product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const openModal = (productId) => {
        setSelectedProductId(productId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProductId(null);
    };

    return (
        <div className='m-3'>
            <button
                className='btn btn-success m-3'
                onClick={() => navigate('/admin/addproduct')}
            >
                Add New Products
            </button>
            <h1>Our Products</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Description</th>
                        {/* <th>Discount</th> */}
                        <th>Packs</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}{product.inventory}</td>
                            <td><img src={product.image} height={50} alt={product.name} /></td>
                            <td>{product.desc}</td>
                            {/* <td>{product.discount}%</td> */}
                            <td>
                                {product.packs.map((pack, index) => (
                                    <div key={index}>
                                        {pack.ml}ml x {pack.unit} - ₹{pack.price}
                                       stock- {pack.inventory}, discount-{pack.discount}
                                    </div>
                                ))}
                            </td>
                            <td className='actions-column'>
                                <Link to={`/admin/product/${product._id}/update`} className='btn btn-outline-success me-3  action-btn'>
                                    <GrDocumentUpdate />
                                </Link>
                                <button
                                    className='btn btn-danger  action-btn'
                                    onClick={() => openModal(product._id)}
                                >
                                    <MdDelete className='' />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Admin_product;