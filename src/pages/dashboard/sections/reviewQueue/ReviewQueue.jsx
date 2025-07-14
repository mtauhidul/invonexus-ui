import { Delete, FilePresent } from "@mui/icons-material";
import { Button, ListItemIcon, MenuItem } from "@mui/material";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MaterialReactTable } from "material-react-table";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import pdfIcon from "../../../../assets/pdf.png";
import { selectCategories } from "../../../../reducers/categoriesReducer";
import {
  addAllDocuments,
  selectDocuments,
} from "../../../../reducers/documentsReducer";
import { selectStatuses } from "../../../../reducers/statusesReducer";
import { selectTags } from "../../../../reducers/tagsReducer";
import { deleteDocument, updateDocument } from "../../../../services/services";
import Styles from "./ReviewQueue.module.css";

const ReviewQueue = () => {
  const documents = useSelector(selectDocuments);
  const statuses = useSelector(selectStatuses);
  const categories = useSelector(selectCategories);
  const tags = useSelector(selectTags);

  const data = useMemo(() => documents, [documents]);
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        id: "vendor",
        header: "Vendor",
        accessorKey: "supplier_name",
        size: 200,
        Cell: ({ row }) => (
          <div className={Styles.vendorCell}>
            <p className={Styles.vendorName}>
              {row.original.supplier_name || "Unknown Vendor"}
            </p>
            <p className={Styles.invoiceInfo}>
              #{row.original.invoice_number || "N/A"}
            </p>
          </div>
        ),
      },
      {
        id: "category",
        header: "Category",
        accessorKey: "category",
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() || "Uncategorized"}
            size="small"
            className={Styles.categoryChip}
            variant="outlined"
          />
        ),
      },
      {
        id: "total_amount",
        header: "Amount",
        accessorKey: "total_amount",
        size: 100,
        Cell: ({ cell }) => {
          const amount = cell.getValue();
          const isLarge = amount >= 1000;
          const isMedium = amount >= 500 && amount < 1000;

          return (
            <div
              className={`${Styles.amountCell} ${
                isLarge
                  ? Styles.amountLarge
                  : isMedium
                  ? Styles.amountMedium
                  : Styles.amountSmall
              }`}
            >
              {amount?.toLocaleString?.("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) || "$0"}
            </div>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        size: 100,
        Cell: ({ cell }) => {
          const status = cell.getValue()?.toLowerCase() || "pending";
          const statusLabel = cell.getValue() || "Pending";
          return (
            <Chip
              label={statusLabel}
              size="small"
              className={`${Styles.statusChip} ${
                Styles[
                  `status${status.charAt(0).toUpperCase() + status.slice(1)}`
                ]
              }`}
            />
          );
        },
      },
      {
        id: "date",
        header: "Date",
        accessorKey: "date",
        size: 90,
        Cell: ({ cell }) => {
          const date = cell.getValue();
          if (!date) return <span className={Styles.noDate}>--</span>;

          try {
            return (
              <div className={Styles.dateCell}>
                {new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            );
          } catch {
            return <span className={Styles.noDate}>--</span>;
          }
        },
      },
    ],
    []
  );

  const handleFieldChange = async (field, event, row) => {
    const newValue = event.target.value;
    const newRow = { ...row.original, [field]: newValue };
    const rowId = row.original.id;
    const res = await updateDocument(rowId, newRow);

    if (res.status === 200) {
      const newDocuments = documents.map((document) =>
        document.id === rowId ? { ...document, [field]: newValue } : document
      );
      dispatch(addAllDocuments(newDocuments));
      toast.success(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } of document ${rowId} changed to ${newValue}`
      );
    } else {
      toast.error(`Error changing ${field} of document ${rowId}`);
    }
  };

  return (
    <div className={Styles.container}>
      {documents.length > 0 ? (
        <div className={Styles.tableContainer}>
          <MaterialReactTable
            columns={columns}
            data={data}
            enableColumnFilterModes
            enableColumnOrdering
            enableGrouping
            enablePinning
            enableRowActions
            enableRowSelection
            enableColumnResizing={true}
            enableFullScreenToggle={true}
            enableDensityToggle={true}
            enableHiding={true}
            enableGlobalFilter={true}
            enableSorting={true}
            enableFilters={true}
            displayColumnDefOptions={{
              "mrt-row-actions": {
                size: 40,
                minSize: 40,
                maxSize: 40,
                header: "Actions",
              },
              "mrt-row-expand": {
                size: 25,
                minSize: 25,
                maxSize: 25,
                header: "",
              },
              "mrt-row-select": {
                size: 25,
                minSize: 25,
                maxSize: 25,
                header: "",
              },
            }}
            initialState={{
              showColumnFilters: false,
              density: "compact",
              pagination: { pageSize: 15 },
            }}
            muiTableContainerProps={{
              sx: { maxHeight: "70vh", minHeight: "400px" },
            }}
            muiTableProps={{
              sx: { tableLayout: "fixed" },
            }}
            muiTableBodyRowProps={{
              sx: {
                "& .MuiTableCell-root": {
                  padding: "4px 6px",
                },
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                "& .MuiTableCell-root": {
                  padding: "6px 6px",
                },
              },
            }}
            positionToolbarAlertBanner="bottom"
            renderDetailPanel={({ row }) => (
              <div className={Styles.detailPanel}>
                <div className={Styles.detailGrid}>
                  <div className={Styles.documentPreviewSection}>
                    <img
                      alt="Document preview"
                      src={pdfIcon}
                      className={Styles.documentThumbnail}
                    />
                    <Button
                      variant="contained"
                      className={Styles.viewDocumentButton}
                      onClick={() =>
                        window.open(row.original.document_url, "_blank")
                      }
                    >
                      View Document
                    </Button>
                  </div>

                  <div className={Styles.detailSection}>
                    <h3 className={Styles.detailSectionTitle}>
                      📋 Document Info
                    </h3>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Document ID</p>
                      <p className={Styles.detailValue}>#{row.original.id}</p>
                    </div>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Supplier</p>
                      <p className={Styles.detailValue}>
                        {row.original.supplier_name || "N/A"}
                      </p>
                    </div>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Address</p>
                      <p className={Styles.detailValue}>
                        {row.original.supplier_address || "N/A"}
                      </p>
                    </div>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Invoice Number</p>
                      <p className={Styles.detailValue}>
                        {row.original.invoice_number || "N/A"}
                      </p>
                    </div>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Invoice Date</p>
                      <p className={Styles.detailValue}>
                        {row.original.date
                          ? new Date(row.original.date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Due Date</p>
                      <p className={Styles.detailValue}>
                        {row.original.due_date
                          ? new Date(row.original.due_date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className={Styles.detailSection}>
                    <h3 className={Styles.detailSectionTitle}>
                      🏷️ Classification
                    </h3>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Category</p>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <Select
                          value={row.original.category || ""}
                          onChange={(event) =>
                            handleFieldChange("category", event, row)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select Category</em>
                          </MenuItem>
                          {categories.map((category) => (
                            <MenuItem
                              key={category.categoryName}
                              value={category.categoryName}
                            >
                              {category.categoryName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Tag</p>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <Select
                          value={row.original.tag || ""}
                          onChange={(event) =>
                            handleFieldChange("tag", event, row)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select Tag</em>
                          </MenuItem>
                          {tags.map((tag) => (
                            <MenuItem key={tag.tagName} value={tag.tagName}>
                              {tag.tagName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Status</p>
                      <Chip
                        label={row.original.status || "Pending"}
                        className={`${Styles.statusChip} ${
                          Styles[
                            `status${
                              (row.original.status || "pending")
                                .charAt(0)
                                .toUpperCase() +
                              (row.original.status || "pending")
                                .slice(1)
                                .toLowerCase()
                            }`
                          ]
                        }`}
                        size="small"
                      />
                    </div>
                    <div className={Styles.detailField}>
                      <h4 className={Styles.detailSectionTitle}>
                        📦 Line Items
                      </h4>
                      {(row.original.line_items || []).length > 0 ? (
                        row.original.line_items.map((item, index) => (
                          <div key={index} className={Styles.lineItem}>
                            <strong>{item.description || "Item"}</strong>
                            <br />
                            Qty: {item.quantity || 1} ×{" "}
                            {item.unit_price ? `$${item.unit_price}` : "N/A"}
                          </div>
                        ))
                      ) : (
                        <p className={Styles.detailValue}>
                          No line items available
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={Styles.detailSection}>
                    <h3 className={Styles.detailSectionTitle}>
                      💰 Financial Summary
                    </h3>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Subtotal</p>
                      <p
                        className={`${Styles.detailValue} ${Styles.summaryAmount}`}
                      >
                        {(
                          row.original.total_amount ||
                          row.original.total_net ||
                          0
                        ).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className={Styles.detailField}>
                      <p className={Styles.detailLabel}>Tax</p>
                      <p
                        className={`${Styles.detailValue} ${Styles.summaryAmount}`}
                      >
                        {(row.original.taxes || 0).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <Divider sx={{ my: 2 }} />
                    <div className={Styles.totalAmount}>
                      Total:{" "}
                      {(
                        row.original.total_net ||
                        row.original.total_amount ||
                        0
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            renderRowActionMenuItems={({ row, closeMenu }) => [
              <MenuItem
                key={2}
                onClick={async () => {
                  if (
                    !confirm(
                      `Are you sure you want to delete document ${row.original.id}?`
                    )
                  ) {
                    window.location.reload();
                    return;
                  }

                  const res = await deleteDocument(row.original.id);

                  if (res.status === 204) {
                    const newDocuments = documents.filter(
                      (document) => document.id !== row.original.id
                    );

                    dispatch(addAllDocuments(newDocuments));

                    toast.success(
                      `Document ${row.original.id} deleted successfully!`
                    );
                  } else {
                    toast.error(`Error deleting document ${row.original.id}`);
                  }

                  closeMenu();
                }}
                sx={{ m: 0, color: "#f44336" }}
              >
                <ListItemIcon>
                  <Delete />
                </ListItemIcon>
                Delete
              </MenuItem>,
            ]}
            renderTopToolbarCustomActions={({ table }) => {
              const handleActivate = (statusName) => {
                table.getSelectedRowModel().flatRows.map(async (row) => {
                  if (
                    !confirm(
                      `Are you sure you want to change the status of document ${row.original.id} to ${statusName}?`
                    )
                  ) {
                    return;
                  }

                  const res = await updateDocument(row.original.id, {
                    status: statusName,
                  });

                  if (res.status === 200) {
                    const newDocuments = documents.map((document) =>
                      document.id === row.original.id
                        ? { ...document, status: statusName }
                        : document
                    );

                    dispatch(addAllDocuments(newDocuments));
                    toast.success(
                      `Status of document ${row.original.id} changed to ${statusName}`
                    );
                  } else {
                    toast.error(
                      `Error changing status of document ${row.original.id}`
                    );
                  }
                });
              };

              return (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {statuses.map((status) => (
                    <Button
                      key={status.statusId}
                      color="success"
                      disabled={!table.getIsSomeRowsSelected()}
                      onClick={() => handleActivate(status.statusName)}
                      variant="contained"
                    >
                      {status.statusName}
                    </Button>
                  ))}
                </div>
              );
            }}
          />
        </div>
      ) : (
        <div className={Styles.noDataContainer}>
          <FilePresent className={Styles.noDataIcon} />
          <p className={Styles.noDataText}>
            No documents found. Start by adding your first document.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;
