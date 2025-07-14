import { Add, Delete, Edit, Flag } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  addStatus,
  deleteStatus,
  getStatuses,
  updateStatus,
} from "../../../../services/services";
// import { data } from './makeData';
import { useDispatch, useSelector } from "react-redux";
import {
  addStatuses,
  selectStatuses,
} from "../../../../reducers/statusesReducer";
import Styles from "./StatusOptions.module.css";

const StatusOptions = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const dispatch = useDispatch();

  const [validationErrors, setValidationErrors] = useState({});
  const statuses = useSelector(selectStatuses);

  const tableData = statuses.map((status) => {
    return {
      id: status.statusId,
      status: status.statusName,
    };
  });

  // const [tableData, setTableData] = useState([...data]);

  const handleCreateNewRow = (values) => {};

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    const data = {
      statusId: row.getValue("id"),
      statusName: values.status,
    };

    const res = await updateStatus(row.getValue("id"), data);
    if (res.status === 200) {
      toast.success("Status updated successfully!");
    } else {
      toast.error("Error updating status");
    }

    const newStatuses = statuses.map((status) => {
      if (status.statusId === row.getValue("id")) {
        return {
          ...status,
          statusName: values.status,
        };
      }
      return status;
    });

    dispatch(addStatuses(newStatuses));
    exitEditingMode();
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = async (row) => {
    if (
      !confirm(
        `Are you sure you want to delete status "${row.getValue("status")}"`
      )
    )
      return;
    const res = await deleteStatus(row.getValue("id"));
    // console.log(res);
    if (res.status === 204) {
      toast.success("Status deleted successfully!");
    } else {
      toast.error("Error deleting status");
    }

    const newStatuses = statuses.filter(
      (status) => status.statusId !== row.getValue("id")
    );

    dispatch(addStatuses(newStatuses));
  };

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.column.accessorKey],
        helperText: validationErrors[cell.column.accessorKey],
        variant: "outlined",
        size: "small",
        sx: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "var(--color-background)",
            borderRadius: "var(--radius-md)",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-primary)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-primary)",
              borderWidth: "2px",
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-error)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "var(--color-text-secondary)",
            "&.Mui-focused": {
              color: "var(--color-primary)",
            },
            "&.Mui-error": {
              color: "var(--color-error)",
            },
          },
          "& .MuiFormHelperText-root": {
            color: "var(--color-error)",
            fontSize: "0.75rem",
          },
        },
        onBlur: (e) => {
          const { name, value } = e.target;
          const error = validateRequired(value);
          setValidationErrors((prev) => ({
            ...prev,
            [name]: error ? "Required" : "",
          }));
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Status ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "status",
        header: "Status Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <div className={Styles.container}>
      <div className={Styles.tableContainer}>
        <MaterialReactTable
          displayColumnDefOptions={{
            "mrt-row-actions": {
              muiTableHeadCellProps: {
                align: "center",
              },
              size: 120,
            },
          }}
          columns={columns}
          data={tableData}
          editingMode="modal"
          enableColumnOrdering
          enableEditing
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          muiEditRowDialogProps={{
            PaperProps: {
              sx: {
                borderRadius: "var(--radius-lg)",
                background: "var(--color-surface)",
                minWidth: "400px",
              },
            },
            sx: {
              "& .MuiDialogTitle-root": {
                background: "var(--color-surface)",
                borderBottom: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 2,
                "&::before": {
                  content: '"🚩"',
                  fontSize: "1.2rem",
                },
              },
              "& .MuiDialogContent-root": {
                background: "var(--color-surface)",
                padding: "1.5rem",
              },
              "& .MuiDialogActions-root": {
                background: "var(--color-surface)",
                borderTop: "1px solid var(--color-border)",
                padding: "1rem 1.5rem",
                gap: "0.5rem",
              },
              "& .MuiButton-outlined": {
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
                "&:hover": {
                  borderColor: "var(--color-primary)",
                  backgroundColor: "var(--color-background)",
                },
              },
              "& .MuiButton-contained": {
                backgroundColor: "var(--color-primary)",
                "&:hover": {
                  backgroundColor: "var(--color-primary-dark)",
                },
              },
            },
          }}
          renderRowActions={({ row, table }) => (
            <Box
              sx={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <Button
              startIcon={<Add />}
              color="primary"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
              sx={{
                backgroundColor: "var(--color-primary)",
                "&:hover": {
                  backgroundColor: "var(--color-primary-dark)",
                },
              }}
            >
              Create New Status
            </Button>
          )}
        />
      </div>

      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        // onSubmit={handleCreateNewRow}
      />
    </div>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const dispatch = useDispatch();
  const fetchStatuses = async () => {
    const res = await getStatuses();
    dispatch(addStatuses(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Creating new status...");

    const data = {
      statusName: values.status,
    };

    const res = await addStatus(data);
    if (res.status === 200) {
      setTimeout(() => {
        toast.dismiss();
        toast.success("Status created successfully!");
      }, 500);
    } else {
      setTimeout(() => {
        toast.dismiss();
        toast.error("Error creating status");
      }, 500);
    }

    onClose();
    fetchStatuses();
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-lg)",
          background: "var(--color-surface)",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          pb: 1,
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Flag sx={{ color: "var(--color-primary)" }} />
          <Typography
            variant="h6"
            sx={{ color: "var(--color-text-primary)", fontWeight: 600 }}
          >
            Create New Status
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ background: "var(--color-surface)", pt: 3 }}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column, index) => (
              <div key={index}>
                {column.accessorKey !== "id" &&
                  column.accessorKey !== "creationDate" && (
                    <TextField
                      fullWidth
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      placeholder={`Enter ${column.header.toLowerCase()}`}
                      variant="outlined"
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "var(--color-background)",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--color-primary)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--color-primary)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "var(--color-text-secondary)",
                          "&.Mui-focused": {
                            color: "var(--color-primary)",
                          },
                        },
                      }}
                    />
                  )}
              </div>
            ))}
          </Stack>
        </form>
      </DialogContent>
      <Divider />
      <DialogActions
        sx={{
          p: "1.5rem",
          background: "var(--color-surface)",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
            "&:hover": {
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-background)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: "var(--color-primary)",
            "&:hover": {
              backgroundColor: "var(--color-primary-dark)",
            },
          }}
        >
          Create Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default StatusOptions;
