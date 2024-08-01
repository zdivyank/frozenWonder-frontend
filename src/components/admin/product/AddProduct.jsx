// import React, { useState } from 'react';
// import { CONFIGS } from '../../../../config';
// import { toast } from 'react-toastify';
// import './addproduct.css';
// import { InputPicker } from 'rsuite';
// import loadingGif from '/public/img/load.gif'; // Adjust the path based on your file structure

// function AddProduct() {
//   const [file, setFile] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     desc: '',
//     price: '',
//     size: ''
//   });
//   const [loading, setLoading] = useState(false); // New state for loading

//   const sizeOptions = ['200ml * 5', '1l * 1'].map(item => ({
//     label: item,
//     value: item,
//   }));

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSizeChange = (value) => {
//     setFormData({ ...formData, size: value });
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); // Set loading to true when form submission starts

//     const form = new FormData();
//     form.append('name', formData.name);
//     form.append('desc', formData.desc);
//     form.append('price', formData.price);
//     form.append('size', formData.size);
//     if (file) {
//       form.append('image', file);
//     }

//     try {
//       const response = await fetch(`${CONFIGS.API_BASE_URL}/addproduct`, {
//         method: 'POST',
//         body: form
//       });

//       const result = await response.json();
//       if (response.ok) {
//         toast.success('Product added successfully!', {
//           position: 'top-center',
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//         setFormData({
//           name: '',
//           desc: '',
//           price: '',
//           size: ''
//         });
//         setFile(null);
//       } else {
//         toast.error(`Error: ${result.message}`);
//       }
//     } catch (error) {
//       console.error('Error adding product:', error);
//       toast.error('An error occurred while adding the product.');
//     } finally {
//       setLoading(false); // Set loading to false when form submission ends
//     }
//   };

//   return (
//     <section className='product_section'>
//       <h1>Add New Product</h1>
//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <label>
//           Product Name:
//           <input type="text" name="name" value={formData.name} className='form-control' onChange={handleChange} required disabled={loading} />
//         </label>

//         <label>
//           Description:
//           <textarea name="desc" value={formData.desc} className='form-control' onChange={handleChange} required disabled={loading} />
//         </label>

//         <label>
//           Price:
//           <input type="number" name="price" value={formData.price} className='form-control' onChange={handleChange} required disabled={loading} />
//         </label>

//         <div className="form-group">
//                     <label>
//                         Size:
//                     </label>
//                     <InputPicker
//                         data={sizeOptions}
//                         value={formData.size}
//                         onChange={handleSizeChange}
//                         style={{ width: 274 }}
//                         cleanable={false}
//                         searchable={true}
//                         creatable
//                         required
//                     />

//                 </div>

//         <label>
//           Image:
//           <input type="file" onChange={handleFileChange} className='form-control' accept="image/*" required disabled={loading} />
//         </label>

//         <button className='btn btn-warning' type="submit" disabled={loading}>
//           {loading ? 'Adding Product...' : 'Add Product'}
//         </button>
//       </form>
//       {loading && (
//         <div className="loading-overlay">
//           <img src={loadingGif} alt="Loading..." className="loading-gif" />
//         </div>
//       )}
//     </section>
//   );
// }

// export default AddProduct;


import React, { useState } from 'react';
import { CONFIGS } from '../../../../config';
import { toast } from 'react-toastify';
import './addproduct.css';
import { InputPicker } from 'rsuite';
import loadingGif from '/public/img/load.gif';

function AddProduct() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    discount: 0,
    packs: [{ ml: '', unit: '', price: '' }]
  });
  const [loading, setLoading] = useState(false);

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
      packs: [...formData.packs, { ml: '', unit: '', price: '' }]
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
    setLoading(true);

    const form = new FormData();
    form.append('name', formData.name);
    form.append('desc', formData.desc);
    form.append('discount', formData.discount);
    form.append('packs', JSON.stringify(formData.packs));
    if (file) {
      form.append('image', file);
    }

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/addproduct`, {
        method: 'POST',
        body: form
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Product added successfully!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFormData({
          name: '',
          desc: '',
          discount: 0,
          packs: [{ ml: '', unit: '', price: '' }]
        });
        setFile(null);
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('An error occurred while adding the product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='product_section'>
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Product Name:
          <input type="text" name="name" value={formData.name} className='form-control' onChange={handleChange} required disabled={loading} />
        </label>

        <label>
          Description:
          <textarea name="desc" value={formData.desc} className='form-control' onChange={handleChange} required disabled={loading} />
        </label>

        <label>
          Discount:
          <input type="number" name="discount" value={formData.discount} className='form-control' onChange={handleChange} required disabled={loading} />
        </label>

        <label>
        Packs:
        </label>
        {formData.packs.map((pack, index) => (
          <div key={index} className="pack-inputs">
            <input
              type="number"
              placeholder="ML"
              value={pack.ml}
              onChange={(e) => handlePackChange(index, 'ml', e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Unit"
              value={pack.unit}
              onChange={(e) => handlePackChange(index, 'unit', e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Price"
              value={pack.price}
              onChange={(e) => handlePackChange(index, 'price', e.target.value)}
              required
              disabled={loading}
            />
            {index > 0 && (
              <button type="button" onClick={() => removePack(index)} disabled={loading}>
                Remove Pack
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addPack} disabled={loading}>
          Add Pack
        </button>

        <label>
          Image:
          <input type="file" onChange={handleFileChange} className='form-control' accept="image/*" required disabled={loading} />
        </label>

        <button className='btn btn-warning' type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
      {loading && (
        <div className="loading-overlay">
          <img src={loadingGif} alt="Loading..." className="loading-gif" />
        </div>
      )}
    </section>
  );
}

export default AddProduct;