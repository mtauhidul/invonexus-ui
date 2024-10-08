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
  addTag,
  deleteTag,
  getTags,
  updateTag,
} from '../../../../services/services';
// import { data } from './makeData';
import { useDispatch, useSelector } from 'react-redux';
import { addTags, selectTags } from '../../../../reducers/tagsReducer';

const TagOptions = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const dispatch = useDispatch();

  const [validationErrors, setValidationErrors] = useState({});
  const tags = useSelector(selectTags);

  const tableData = tags.map((tag) => {
    return {
      id: tag.tagId,
      tag: tag.tagName,
    };
  });

  // const [tableData, setTableData] = useState([...data]);

  const handleCreateNewRow = (values) => {};

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    const data = {
      tagId: row.getValue('id'),
      tagName: values.tag,
    };

    const res = await updateTag(row.getValue('id'), data);
    if (res.status === 200) {
      toast.success('Tag updated successfully!');
    } else {
      toast.error('Error updating tag');
    }

    const newTags = tags.map((tag) => {
      if (tag.tagId === row.getValue('id')) {
        return {
          ...tag,
          tagName: values.tag,
        };
      }
      return tag;
    });

    dispatch(addTags(newTags));
    exitEditingMode();
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = async (row) => {
    if (
      !confirm(`Are you sure you want to delete tag "${row.getValue('tag')}"`)
    )
      return;
    const res = await deleteTag(row.getValue('id'));
    // console.log(res);
    if (res.status === 204) {
      toast.success('Tag deleted successfully!');
    } else {
      toast.error('Error deleting tag');
    }

    const newTags = tags.filter((tag) => tag.tagId !== row.getValue('id'));

    dispatch(addTags(newTags));
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
        header: 'Tag ID',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'tag',
        header: 'Tag Name',
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
            Create New Tag
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
  const fetchTags = async () => {
    const res = await getTags();
    dispatch(addTags(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading('Creating new tag...');

    const data = {
      tagName: values.tag,
    };

    const res = await addTag(data);
    if (res.status === 200) {
      setTimeout(() => {
        toast.dismiss();
        toast.success('Tag created successfully!');
      }, 500);
    } else {
      setTimeout(() => {
        toast.dismiss();
        toast.error('Error creating tag');
      }, 500);
    }

    onClose();
    fetchTags();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign='center'>Create New Tag</DialogTitle>
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
          Create New Tag
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

export default TagOptions;
