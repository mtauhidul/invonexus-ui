import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import pdfIcon from "../../../../assets/pdf.png";
import { addAllDocuments } from "../../../../reducers/documentsReducer";
import {
  addDocument,
  getDocuments,
  textExtract,
} from "../../../../services/services";
import AddCategory from "./AddCategory";
import Styles from "./AddNewDocument.module.css";
import AddTag from "./AddTag";

const FileItem = ({ file }) => (
  <div className={Styles.fileItem}>
    <img src={pdfIcon} alt="PDF file" className={Styles.fileIcon} />
    <p className={Styles.fileName}>
      {file.name.length > 25 ? file.name.substring(0, 25) + "..." : file.name}
    </p>
  </div>
);

FileItem.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const FilePreview = ({ files }) => {
  if (files.length === 0) return null;

  return (
    <div className={Styles.filePreviewContainer}>
      <h3 className={Styles.filePreviewTitle}>Selected Files</h3>
      <div className={Styles.fileList}>
        {files.map((file, index) => (
          <FileItem key={index} file={file} />
        ))}
      </div>
    </div>
  );
};

FilePreview.propTypes = {
  files: PropTypes.array.isRequired,
};

const AddNewDocument = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("Submit Document");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");

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
    setStatus("Saving to database ...");
    const data = {
      ...invoice,
      status: "Pending",
      tag,
      category,
      document_url: fileUrlRes,
    };

    const res = await addDocument(data);
    if (res.status === 200 && res.data.id) {
      setTimeout(() => {
        setStatus("Document added successfully ✅");
        fetchAndDispatchDocuments();
      }, 2000);
    }

    setTimeout(() => {
      setStatus("Submit Document");
      setFiles([]);
      setTag("");
      setCategory("");
    }, 4000);

    return res;
  };

  const handleTextExtraction = async (file) => {
    setStatus("Extracting Text ...");
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
        setStatus("Document added successfully ✅");
      }, 2000);
    } else {
      setTimeout(() => {
        setStatus("Error adding document ❌");
      }, 2000);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
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
    <div className={Styles.container}>
      <div className={Styles.formSection}>
        <div
          {...getRootProps({ className: "dropzone" })}
          className={`${Styles.dropzoneContainer} ${
            isDragActive ? Styles.active : ""
          }`}
        >
          <input {...getInputProps()} />
          <div className={Styles.dropzoneContent}>
            <CloudUploadIcon className={Styles.dropzoneIcon} />
            <p className={Styles.dropzoneText}>
              Drop your PDF files here, or click to browse
            </p>
            <p className={Styles.dropzoneSubtext}>
              Supports PDF files up to 10MB
            </p>
          </div>
        </div>

        <FilePreview files={files} />

        {files.length > 0 && (
          <div className={Styles.selectorsContainer}>
            <div className={Styles.selectorGroup}>
              <label className={Styles.selectorLabel}>Tag</label>
              <AddTag tag={tag} setTag={setTag} />
            </div>
            <div className={Styles.selectorGroup}>
              <label className={Styles.selectorLabel}>Category</label>
              <AddCategory category={category} setCategory={setCategory} />
            </div>
          </div>
        )}

        {files.length > 0 && tag.length > 0 && category.length > 0 && (
          <div className={Styles.submitButtonContainer}>
            <Button
              className={Styles.submitButton}
              onClick={() => handleTextExtraction(files[0])}
              variant="contained"
              disabled={status !== "Submit Document"}
              size="large"
            >
              {status === "Submit Document" ? (
                "Process Document"
              ) : status.includes("✅") ? (
                status
              ) : (
                <div className={Styles.loadingContainer}>
                  <ThreeDots
                    height="20"
                    width="20"
                    radius="9"
                    color="currentColor"
                    ariaLabel="three-dots-loading"
                    visible={true}
                  />
                  <span>{status}</span>
                </div>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewDocument;
