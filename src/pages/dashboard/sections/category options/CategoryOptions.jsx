import { Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../../../services/services';
// import { data } from './makeData';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCategories,
  selectCategories,
} from '../../../../reducers/categoriesReducer';

const CategoryOptions = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const dispatch = useDispatch();

  const [validationErrors, setValidationErrors] = useState({});
  const categories = useSelector(selectCategories);

  const tableData = categories.map((category) => {
    return {
      id: category.categoryId,
      category: category.categoryName,
    };
  });

  // const [tableData, setTableData] = useState([...data]);

  const handleCreateNewRow = (values) => {};

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    const data = {
      categoryId: row.getValue('id'),
      categoryName: values.category,
    };

    const res = await updateCategory(row.getValue('id'), data);
    if (res.status === 200) {
      toast.success('Category updated successfully!');
    } else {
      toast.error('Error updating category');
    }

    const newCategories = categories.map((category) => {
      if (category.categoryId === row.getValue('id')) {
        return {
          ...category,
          categoryName: values.category,
        };
      }
      return category;
    });

    dispatch(addCategories(newCategories));
    exitEditingMode();
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = async (row) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${row.getValue('category')}"`
      )
    )
      return;
    const res = await deleteCategory(row.getValue('id'));
    // console.log(res);
    if (res.status === 204) {
      toast.success('Category deleted successfully!');
    } else {
      toast.error('Error deleting category');
    }

    const newCategories = categories.filter(
      (category) => category.categoryId !== row.getValue('id')
    );

    dispatch(addCategories(newCategories));
  };

  const getCommonEditTextFieldProps = useCallback((cell) => {
    return {
      error: !!validationErrors[cell.column.accessorKey],
      helperText: validationErrors[cell.column.accessorKey],
      onBlur: (e) => {
        const { name, value } = e.target;
        const error = validateRequired(value);
        setValidationErrors((prev) => ({
          ...prev,
          [name]: error ? 'Required' : '',
        }));
      },
    };
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Category ID',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'category',
        header: 'Category Name',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode='modal' //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Tooltip arrow placement='left' title='Edit'>
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement='right' title='Delete'>
              <IconButton color='error' onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color='secondary'
            sx={{
              backgroundColor: '#375a64',
              '&:hover': {
                backgroundColor: '#2a454e',
              },
            }}
            onClick={() => setCreateModalOpen(true)}
            variant='contained'>
            Create New Category
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        // onSubmit={handleCreateNewRow}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {})
  );

  const dispatch = useDispatch();
  const fetchCategories = async () => {
    const res = await getCategories();
    dispatch(addCategories(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading('Creating new category...');

    const data = {
      categoryName: values.category,
    };

    const res = await addCategory(data);
    if (res.status === 200) {
      setTimeout(() => {
        toast.dismiss();
        toast.success('Category created successfully!');
      }, 500);
    } else {
      setTimeout(() => {
        toast.dismiss();
        toast.error('Error creating category');
      }, 500);
    }

    onClose();
    fetchCategories();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign='center'>Create New Category</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}>
            {columns.map((column, index) => (
              <div key={index}>
                {column.accessorKey !== 'id' &&
                  column.accessorKey !== 'creationDate' && (
                    <TextField
                      fullWidth
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  )}
              </div>
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color='secondary'
          sx={{
            backgroundColor: '#375a64',
            '&:hover': {
              backgroundColor: '#2a454e',
            },
          }}
          onClick={handleSubmit}
          variant='contained'>
          Create New Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;

export default CategoryOptions;
