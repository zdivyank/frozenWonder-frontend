// // import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { toast } from 'react-toastify';
// // import { InputPicker } from 'rsuite';
// // import { CONFIGS } from '../../../../config';
// // import loadingGif from '/public/img/load.gif';

// // import './updateproduct.css';

// // function UpdateProduct() {
// //     const { _id } = useParams();
// //     const [file, setFile] = useState(null);
// //     const [formData, setFormData] = useState({
// //         name: '',
// //         desc: '',
// //         price: '',
// //         size: ''
// //     });
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [isSubmitting, setIsSubmitting] = useState(false);

// //     const sizeOptions = [
// //         { label: '200ml * 5', value: '200ml * 5' },
// //         { label: '1l * 1', value: '1l * 1' }
// //     ];

// //     const handleSizeChange = (value) => {
// //         setFormData({ ...formData, size: value });
// //     };


// //     useEffect(() => {
// //         const fetchProductDetails = async () => {
// //             setIsLoading(true);
// //             try {
// //                 const response = await fetch(`${CONFIGS.API_BASE_URL}/viewproducts/${_id}`);
// //                 const result = await response.json();

// //                 if (response.ok) {
// //                     setFormData({
// //                         name: result.message.name,
// //                         desc: result.message.desc,
// //                         price: result.message.price,
// //                         size: result.message.size
// //                     });
// //                 } else {
// //                     console.error('Error fetching product details:', result.message);
// //                     toast.error('Failed to load product details.');
// //                 }
// //             } catch (error) {
// //                 console.error('Error fetching product details:', error);
// //                 toast.error('An error occurred while loading product details.');
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };

// //         fetchProductDetails();
// //     }, [_id]);

// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData({ ...formData, [name]: value });
// //     };

// //     const handleFileChange = (e) => {
// //         setFile(e.target.files[0]);
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setIsSubmitting(true);

// //         const form = new FormData();
// //         form.append('name', formData.name);
// //         form.append('desc', formData.desc);
// //         form.append('price', formData.price);
// //         form.append('size', formData.size);
// //         if (file) {
// //             form.append('image', file);
// //         }

// //         try {
// //             const response = await fetch(`${CONFIGS.API_BASE_URL}/updateproduct/${_id}`, {
// //                 method: 'PUT',
// //                 body: form
// //             });

// //             const result = await response.json();
// //             if (response.ok) {
// //                 toast.success('Product updated successfully!', {
// //                     position: 'top-center',
// //                     autoClose: 5000,
// //                     hideProgressBar: false,
// //                     closeOnClick: true,
// //                     pauseOnHover: true,
// //                     draggable: true,
// //                     progress: undefined,
// //                 });
// //                 setFormData({
// //                     name: '',
// //                     desc: '',
// //                     price: '',
// //                     size: ''
// //                 });
// //                 setFile(null);
// //             } else {
// //                 toast.error(`Error: ${result.message}`);
// //             }
// //         } catch (error) {
// //             console.error('Error updating product:', error);
// //             toast.error('An error occurred while updating the product.');
// //         } finally {
// //             setIsSubmitting(false);
// //         }
// //     };

// //     if (isLoading) {
// //         return <div className="loading-screen"><img src={loadingGif} alt="Loading..." /></div>;
// //     }

// //     return (
// //         <section className='product_section'>
// //             <h1>Update Product</h1>
// //             <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-container">
// //                 <div className="form-group">
// //                     <label>Product Name:</label>
// //                     <input
// //                         type="text"
// //                         name="name"
// //                         value={formData.name}
// //                         className='form-control'
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                 </div>

// //                 <div className="form-group">
// //                     <label>Description:</label>
// //                     <textarea
// //                         name="desc"
// //                         value={formData.desc}
// //                         className='form-control'
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                 </div>

// //                 <div className="form-group">
// //                     <label>Price:</label>
// //                     <input
// //                         type="number"
// //                         name="price"
// //                         value={formData.price}
// //                         className='form-control'
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                 </div>

// //                 <div className="form-group">
// //                     <label>
// //                         Size:
// //                     </label>
// //                     <InputPicker
// //                         data={sizeOptions}
// //                         value={formData.size}
// //                         onChange={handleSizeChange}
// //                         style={{ width: 274 }}
// //                         cleanable={false}
// //                         searchable={true}
// //                         creatable
// //                         required
// //                     />

// //                 </div>

// //                 <div className="form-group">
// //                     <label>Image:</label>
// //                     <input
// //                         type="file"
// //                         onChange={handleFileChange}
// //                         className='form-control'
// //                         accept="image/*"
// //                     />
// //                 </div>

// //                 <button className='btn btn-warning' type="submit" disabled={isSubmitting}>
// //                     {isSubmitting ? 'Updating...' : 'Update Product'}
// //                 </button>
// //             </form>
// //         </section>
// //     );
// // }

// // export default UpdateProduct;



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { CONFIGS } from '../../../../config';
// import loadingGif from '/public/img/load.gif';

// import './updateproduct.css';

// function UpdateProduct() {
//     const { _id } = useParams();
//     const [file, setFile] = useState(null);
//     const [formData, setFormData] = useState({
//         name: '',
//         desc: '',
//         discount: 0,
//         packs: [],
//         inventory:'',
//     });
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         const fetchProductDetails = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await fetch(`${CONFIGS.API_BASE_URL}/viewproducts/${_id}`);
//                 const result = await response.json();

//                 if (response.ok) {
//                     setFormData({
//                         name: result.message.name,
//                         desc: result.message.desc,
//                         discount: result.message.discount || 0,
//                         packs: result.message.packs || [],
//                         inventory:result.message.inventory,
//                     });
//                 } else {
//                     console.error('Error fetching product details:', result.message);
//                     toast.error('Failed to load product details.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching product details:', error);
//                 toast.error('An error occurred while loading product details.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchProductDetails();
//     }, [_id]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handlePackChange = (index, field, value) => {
//         const newPacks = [...formData.packs];
//         newPacks[index][field] = value;
//         setFormData({ ...formData, packs: newPacks });
//     };

//     const addPack = () => {
//         setFormData({
//             ...formData,
//             packs: [...formData.packs, { ml: '', unit: '', price: '' }]
//         });
//     };

//     const removePack = (index) => {
//         const newPacks = formData.packs.filter((_, i) => i !== index);
//         setFormData({ ...formData, packs: newPacks });
//     };

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         const form = new FormData();
//         form.append('name', formData.name);
//         form.append('desc', formData.desc);
//         form.append('discount', formData.discount);
//         form.append('packs', JSON.stringify(formData.packs));
//         form.append('inventory', formData.inventory);
//         if (file) {
//             form.append('image', file);
//         }

//         try {
//             const response = await fetch(`${CONFIGS.API_BASE_URL}/updateproduct/${_id}`, {
//                 method: 'PUT',
//                 body: form
//             });

//             const result = await response.json();
//             if (response.ok) {
//                 toast.success('Product updated successfully!', {
//                     position: 'top-center',
//                     autoClose: 5000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                 });
//             } else {
//                 toast.error(`Error: ${result.message}`);
//             }
//         } catch (error) {
//             console.error('Error updating product:', error);
//             toast.error('An error occurred while updating the product.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isLoading) {
//         return <div className="loading-screen"><img src={loadingGif} alt="Loading..." /></div>;
//     }

//     return (
//         <section className='product_section'>
//             <h1>Update Product</h1>
//             <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-container">
//                 <div className="form-group">
//                     <label>Product Name:</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         className='form-control'
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Description:</label>
//                     <textarea
//                         name="desc"
//                         value={formData.desc}
//                         className='form-control'
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Discount:</label>
//                     <input
//                         type="number"
//                         name="discount"
//                         value={formData.discount}
//                         className='form-control'
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Packs:</label>
//                     {formData.packs.map((pack, index) => (
//                         <div key={index} className="pack-inputs">
//                             <input
//                                 type="number"
//                                 placeholder="ML"
//                                 value={pack.ml}
//                                 onChange={(e) => handlePackChange(index, 'ml', e.target.value)}
//                                 required
//                             />
//                             <input
//                                 type="number"
//                                 placeholder="Unit"
//                                 value={pack.unit}
//                                 onChange={(e) => handlePackChange(index, 'unit', e.target.value)}
//                                 required
//                             />
//                             <input
//                                 type="number"
//                                 placeholder="Price"
//                                 value={pack.price}
//                                 onChange={(e) => handlePackChange(index, 'price', e.target.value)}
//                                 required
//                             />
//                             {formData.packs.length > 1 && (
//                                 <button type="button" onClick={() => removePack(index)}>
//                                     Remove Pack
//                                 </button>
//                             )}
//                         </div>
//                     ))}
//                     <button type="button" onClick={addPack}>
//                         Add Pack
//                     </button>
//                 </div>

//                 <div className="form-group">
//                     <label>Image:</label>
//                     <input
//                         type="file"
//                         onChange={handleFileChange}
//                         className='form-control'
//                         accept="image/*"
//                     />
//                 </div>

//                 <div className="form-group">
//                 <label>
//                     Inventory:
//                     <input type="text" name="inventory" className='form-control' onChange={handleChange}  value={formData.inventory} required />

//                     {/* <input type="text" onChange={handleFileChange} className='form-control'  required disabled={loading} /> */}
//                 </label>
//                 </div>


//                 <button className='btn btn-warning' type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? 'Updating...' : 'Update Product'}
//                 </button>
//             </form>
//         </section>
//     );
// }

// export default UpdateProduct;



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CONFIGS } from '../../../../config';
import loadingGif from '/img/load.gif';

import './updateproduct.css';

function UpdateProduct() {
    const { _id } = useParams();
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        desc: '',
        packs: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${CONFIGS.API_BASE_URL}/viewproducts/${_id}`);
                const result = await response.json();

                if (response.ok) {
                    setFormData({
                        name: result.message.name,
                        desc: result.message.desc,
                        packs: result.message.packs || [],
                    });
                } else {
                    console.error('Error fetching product details:', result.message);
                    toast.error('Failed to load product details.');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
                toast.error('An error occurred while loading product details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePackChange = (index, field, value) => {
        const newPacks = [...formData.packs];
        newPacks[index][field] = value;
        setFormData({ ...formData, packs: newPacks });
    };

    const addPack = () => {
        setFormData({
            ...formData,
            packs: [...formData.packs, { ml: '', unit: '', price: '', discount: '', inventory: '' }]
        });
    };

    const removePack = (index) => {
        const newPacks = formData.packs.filter((_, i) => i !== index);
        setFormData({ ...formData, packs: newPacks });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = new FormData();
        form.append('name', formData.name);
        form.append('desc', formData.desc);
        form.append('packs', JSON.stringify(formData.packs));
        if (file) {
            form.append('image', file);
        }

        try {
            const response = await fetch(`${CONFIGS.API_BASE_URL}/updateproduct/${_id}`, {
                method: 'PUT',
                body: form
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Product updated successfully!', {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('An error occurred while updating the product.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="loading-screen"><img src={loadingGif} alt="Loading..." /></div>;
    }

    return (
        <section className='product_section'>
            <h1>Update Product</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-container">
                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        className='form-control'
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="desc"
                        value={formData.desc}
                        className='form-control'
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Packs:</label>
                    {formData.packs.map((pack, index) => (
                        <div key={index} className="pack-inputs">
                             <p>Ml:</p>
                            <input
                                type="number"
                                placeholder="ML"
                                value={pack.ml}
                                onChange={(e) => handlePackChange(index, 'ml', e.target.value)}
                                required
                                />
                                <p>Unit:</p>
                            <input
                                type="number"
                                placeholder="Unit"
                                value={pack.unit}
                                onChange={(e) => handlePackChange(index, 'unit', e.target.value)}
                                required
                            />
                                <p>Price:</p>
                            <input
                                type="number"
                                placeholder="Price"
                                value={pack.price}
                                onChange={(e) => handlePackChange(index, 'price', e.target.value)}
                                required
                                />
                                <p>Discount:</p>
                            <input
                                type="number"
                                placeholder="Discount"
                                value={pack.discount}
                                onChange={(e) => handlePackChange(index, 'discount', e.target.value)}
                                required
                                />
                                <p>Inventory:</p>
                            <input
                                type="number"
                                placeholder="Inventory"
                                value={pack.inventory}
                                onChange={(e) => handlePackChange(index, 'inventory', e.target.value)}
                                required
                            />
                            {formData.packs.length > 1 && (
                                <button type="button"  className='btn btn-danger m-3' onClick={() => removePack(index)}>
                                    Remove Pack
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                    <button type="button" className='btn btn-dark m-3 xl-3' onClick={addPack}>
                        Add Pack
                    </button>

                <div className="form-group">
                    <label>Image:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className='form-control'
                        accept="image/*"
                    />
                </div>

                <button className='btn btn-warning' type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </section>
    );
}

export default UpdateProduct;

