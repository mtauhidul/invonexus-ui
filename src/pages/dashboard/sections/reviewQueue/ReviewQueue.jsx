import React, { useMemo } from 'react';

import InputLabel from '@mui/material/InputLabel';
import { MaterialReactTable } from 'material-react-table';

import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import pdfIcon from '../../../../assets/pdf.png';

import { Delete } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { toast } from 'react-hot-toast';
import { Circles } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategories } from '../../../../reducers/categoriesReducer';
import {
  addAllDocuments,
  selectDocuments,
} from '../../../../reducers/documentsReducer';
import { selectStatuses } from '../../../../reducers/statusesReducer';
import { selectTags } from '../../../../reducers/tagsReducer';
import { deleteDocument, updateDocument } from '../../../../services/services';

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
        id: 'id',
        header: 'ID',
        accessorKey: 'id', // Define the accessorKey for the 'Document ID' column
        size: 100,
      },
      {
        id: 'supplier_name',
        header: 'Supplier Name',
        accessorKey: 'supplier_name', // Define the accessorKey for the 'Vendor Name' column
        size: 200,
      },
      {
        id: 'category',
        header: 'Category',
        accessorKey: 'category', // Define the accessorKey for the 'Category' column
        size: 100,
      },
      {
        id: 'tag',
        header: 'Tag',
        accessorKey: 'tag', // Define the accessorKey for the 'Tag' column
        size: 100,
      },
      {
        id: 'total_amount',
        header: 'Total Amount',
        accessorKey: 'total_amount', // Define the accessorKey for the 'Amount' column
        size: 100,
        Cell: ({ cell }) => (
          <Box
            component='span'
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() < 50_0
                  ? theme.palette.error.dark
                  : cell.getValue() >= 50_0 && cell.getValue() < 75_0
                  ? theme.palette.warning.dark
                  : theme.palette.success.dark,
              borderRadius: '0.25rem',
              color: '#fff',
              maxWidth: '9ch',
              p: '0.25rem',
            })}>
            {cell.getValue()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Box>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status', // Define the accessorKey for the 'Review Status' column
        size: 150,
      },
    ],
    []
  );

  const handleFieldChange = async (field, event, row) => {
    const newValue = event.target.value;

    const newRow = {
      ...row.original,
      [field]: newValue,
    };

    const rowId = row.original.id;

    const res = await updateDocument(rowId, newRow);

    console.log(res.status);

    if (res.status === 200) {
      const newDocuments = documents.map((document) => {
        if (document.id === rowId) {
          return {
            ...document,
            [field]: newValue,
          };
        }
        return document;
      });

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
    <div
      style={{
        height: '100%',
        minHeight: '80vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
      {documents.length > 0 ? (
        <MaterialReactTable
          columns={columns}
          data={data}
          enableColumnFilterModes
          enableColumnOrdering
          enableGrouping
          enablePinning
          enableRowActions
          enableRowSelection
          initialState={{ showColumnFilters: true }}
          positionToolbarAlertBanner='bottom'
          renderDetailPanel={({ row }) => (
            console.log(row),
            (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}>
                  <img
                    alt='avatar'
                    height={200}
                    src={pdfIcon}
                    loading='lazy'
                    style={{
                      boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.25)',
                      borderRadius: '0.25rem',
                      padding: '1rem',
                    }}
                  />
                  <Button
                    variant='outlined'
                    onClick={() =>
                      window.open(row.original.document_url, '_blank')
                    }>
                    View Document
                  </Button>
                </Box>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  p={3}
                  component={Paper}
                  sx={{
                    width: '100%',
                    maxWidth: '80%',
                    height: '100%',
                    overflow: 'auto',
                  }}>
                  <Box width='30%'>
                    <Chip
                      label={row.original.id}
                      color='primary'
                      sx={{
                        borderRadius: '0.25rem',
                        mb: 1,
                        width: '100%',
                      }}
                    />
                    <Typography variant='h6'>
                      {row.original.supplier_name}
                    </Typography>
                    <Typography>{row.original.supplier_address}</Typography>
                    <Typography>
                      {row.original?.contacts?.reference_numbers}
                    </Typography>
                    <Divider
                      sx={{
                        my: 1,
                      }}
                    />
                    <Typography>
                      Invoice Number: {row.original.invoice_number}
                    </Typography>
                    <Typography>Invoice Date: {row.original.date}</Typography>
                    <Typography>Due Date: {row.original.due_date}</Typography>
                  </Box>
                  <Box width='30%'>
                    <FormControl
                      variant='filled'
                      sx={{
                        borderRadius: '0.25rem',
                        mb: 1,
                        width: '100%',
                      }}>
                      <InputLabel id='demo-simple-select-standard-label'>
                        Category
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-filled-label'
                        id='demo-simple-select-filled'
                        value={row.original.category}
                        onChange={(event) =>
                          handleFieldChange('category', event, row)
                        }>
                        {categories.map((category) => (
                          <MenuItem value={category.categoryName}>
                            {category.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      variant='filled'
                      sx={{
                        borderRadius: '0.25rem',
                        mb: 1,
                        width: '100%',
                      }}>
                      <InputLabel id='demo-simple-select-standard-label'>
                        Tag
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-filled-label'
                        id='demo-simple-select-filled'
                        value={row.original.tag}
                        onChange={(event) =>
                          handleFieldChange('tag', event, row)
                        }>
                        {tags.map((tag) => (
                          <MenuItem value={tag.tagName}>{tag.tagName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography variant='h6'>Items</Typography>
                    <Divider
                      sx={{
                        my: 1,
                      }}
                    />
                    {row.original.line_items.map((item, index) => (
                      <Typography key={index + 100}>
                        {item.description} - {item.quantity} x {item.unit_price}
                      </Typography>
                    ))}
                  </Box>
                  <Box width='30%'>
                    <Chip
                      label={row.original.status}
                      color='success'
                      sx={{
                        borderRadius: '0.25rem',
                        mb: 1,
                        width: '100%',
                      }}
                    />
                    <Typography variant='h6'>Invoice Summary</Typography>
                    <Divider
                      sx={{
                        my: 1,
                      }}
                    />
                    <Typography>
                      {'Subtotal: ' +
                        (row.original.total_amount
                          ? row.original.total_amount
                          : row.original.total_net
                        )?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }) || 'Subtotal'}
                    </Typography>
                    <Typography>
                      {'Tax: ' +
                        row.original.taxes?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }) || 'Tax'}
                    </Typography>
                    <Divider
                      sx={{
                        my: 1,
                      }}
                    />
                    <Typography>
                      {'Total: ' +
                        (row.original.total_net
                          ? row.original.total_net
                          : row.original.total_amount
                        )?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }) || 'Total'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )
          )}
          renderRowActionMenuItems={({ row, closeMenu }) => [
            <MenuItem
              key={2}
              onClick={async () => {
                // Delete confirmation alert
                // eslint-disable-next-line no-restricted-globals
                !confirm(
                  `Are you sure you want to delete document ${row.original.id}?`
                ) && window.location.reload();

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
              sx={{ m: 0, color: '#f44336' }}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              Delete
            </MenuItem>,
          ]}
          renderTopToolbarCustomActions={({ table }) => {
            const handleActivate = (statusName) => {
              table.getSelectedRowModel().flatRows.map(async (row) => {
                !confirm(
                  `Are you sure you want to change the status of document ${row.original.id} to ${statusName}?`
                ) && null;

                const res = await updateDocument(row.original.id, {
                  status: statusName,
                });

                if (res.status === 200) {
                  const newDocuments = documents.map((document) => {
                    if (document.id === row.original.id) {
                      return {
                        ...document,
                        status: statusName,
                      };
                    }
                    return document;
                  });

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
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {statuses.map((status) => (
                  <Button
                    key={status.statusId}
                    color='success'
                    disabled={!table.getIsSomeRowsSelected()}
                    onClick={() => handleActivate(status.statusName)}
                    variant='contained'>
                    {status.statusName}
                  </Button>
                ))}
              </div>
            );
          }}
        />
      ) : (
        <Circles
          height='120'
          width='120'
          color='#5CCEA8'
          ariaLabel='circles-loading'
          wrapperStyle={{
            marginTop: '7rem',
          }}
          wrapperClass=''
          visible={true}
        />
      )}
    </div>
  );
};

export default ReviewQueue;
