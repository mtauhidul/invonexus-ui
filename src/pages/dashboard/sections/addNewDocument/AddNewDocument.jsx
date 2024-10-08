import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import pdfIcon from '../../../../assets/pdf.png';
import { addAllDocuments } from '../../../../reducers/documentsReducer';
import {
  addDocument,
  getDocuments,
  textExtract,
} from '../../../../services/services';
import AddCategory from './AddCategory';
import AddTag from './AddTag';

const styles = {
  thumb: {
    display: 'inline-flex',
    borderRadius: 4,
    border: '1px solid #eaeaea',
    backgroundColor: '#fafafa',
    marginBottom: 8,
    marginRight: 8,
    width: 200,
    height: 60,
    padding: 6,
    boxSizing: 'border-box',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    fontFamily: 'Exo, sans-serif',
    color: '#2A454E',
  },
};

const ThumbsContainer = ({ files }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16,
    }}>
    {files.map((file, index) => (
      <Thumb key={index} file={file} />
    ))}
  </Box>
);

const Thumb = ({ file }) => (
  <div style={styles.thumb}>
    <div style={{ display: 'flex', minWidth: 0, overflow: 'hidden' }}>
      <img
        src={pdfIcon}
        style={{
          display: 'block',
          width: '25px',
          height: '25px',
          objectFit: 'contain',
          margin: 'auto',
          marginRight: '0.5rem',
        }}
        onLoad={() => URL.revokeObjectURL(file.preview)}
        alt={`Preview of ${file.name}`}
      />
      <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
        {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
      </p>
    </div>
  </div>
);

const AddNewDocument = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('Submit Document');
  const [tag, setTag] = useState('');
  const [category, setCategory] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const fetchAndDispatchDocuments = async () => {
    const res = await getDocuments();
    dispatch(addAllDocuments(res.data));
  };

  const createNewDocument = async (fileUrlRes, invoice) => {
    setStatus('Saving to database ...');
    const data = {
      ...invoice,
      status: 'Pending',
      tag,
      category,
      document_url: fileUrlRes,
    };

    const res = await addDocument(data);
    if (res.status === 200 && res.data.id) {
      setTimeout(() => {
        setStatus('Document added successfully ✅');
        fetchAndDispatchDocuments();
      }, 2000);
    }

    setTimeout(() => {
      setStatus('Submit Document');
      setFiles([]);
      setTag('');
      setCategory('');
    }, 4000);

    return res;
  };

  const handleTextExtraction = async (file) => {
    setStatus('Extracting Text ...');
    const extractedText = await textExtract(file);
    const invoiceFileURL = extractedText.data.fileUrl;
    const prediction =
      extractedText.data.invoiceData.document.inference.prediction;

    const parsedData = {
      customer_address: prediction.customer_address.value,
      customer_company_registrations:
        prediction.customer_company_registrations.value,
      customer_name: prediction.customer_name.value,
      date: prediction.date.value,
      document_type: prediction.document_type.value,
      due_date: prediction.due_date.value,
      invoice_number: prediction.invoice_number.value,
      line_items: prediction.line_items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      locale: {
        currency: prediction.locale.currency,
        language: prediction.locale.language,
      },
      reference_numbers: prediction.reference_numbers.value,
      supplier_address: prediction.supplier_address.value,
      supplier_company_registrations:
        prediction.supplier_company_registrations.value,
      supplier_name: prediction.supplier_name.value,
      supplier_payment_details: prediction.supplier_payment_details.value,
      taxes: prediction.taxes.value ? prediction.taxes.value : [0],
      total_amount: prediction.total_amount.value,
      total_net: prediction.total_net.value,
    };

    console.log(parsedData);

    const res = await createNewDocument(invoiceFileURL, parsedData);

    if (res.status === 200) {
      setTimeout(() => {
        setStatus('Document added successfully ✅');
      }, 2000);
    } else {
      setTimeout(() => {
        setStatus('Error adding document ❌');
      }, 2000);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': 'pdf',
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file, index) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            key: index,
          })
        )
      );
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 300,
        width: '100%',
      }}>
      <Box
        {...getRootProps({ className: 'dropzone' })}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          border: '1px dashed #2A454E',
          borderRadius: '4px',
          backgroundColor: '#fafafa',
          color: '#2A454E',
          outline: 'none',
          transition: 'border .24s ease-in-out',
          padding: '2rem 2.5rem',
          cursor: 'pointer',
        }}>
        <input {...getInputProps()} />
        <p>
          Drag 'n' drop some files here, or click to select files for adding new
          documents.
        </p>
      </Box>
      <ThumbsContainer files={files} />
      {files.length > 0 && (
        <Box sx={{ width: '50%', minWidth: '10rem', height: '100%', mt: 2 }}>
          <AddTag tag={tag} setTag={setTag} />
        </Box>
      )}
      {files.length > 0 && (
        <Box sx={{ width: '50%', minWidth: '10rem', height: '100%', mt: 1 }}>
          <AddCategory category={category} setCategory={setCategory} />
        </Box>
      )}
      {files.length > 0 && tag.length > 0 && category.length > 0 && (
        <Button
          sx={{
            width: '50%',
            minWidth: '10rem',
            marginTop: '1rem',
            height: '2.7rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            fontFamily: 'Exo, sans-serif',
            backgroundColor: '#375a64',
            '&:hover': {
              backgroundColor: '#2a454e',
            },
          }}
          onClick={() => handleTextExtraction(files[0])}
          variant='contained'
          color='success'>
          {status}
        </Button>
      )}
    </Box>
  );
};

export default AddNewDocument;
