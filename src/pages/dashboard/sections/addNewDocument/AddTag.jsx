import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useSelector } from "react-redux";
import { selectTags } from "../../../../reducers/tagsReducer";

export default function AddTag({ tag, setTag }) {
  const tags = useSelector(selectTags);

  const handleChange = (event) => {
    setTag(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Tag</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tag}
          label="Select Tag"
          onChange={handleChange}
        >
          {tags.map((tag) => (
            <MenuItem key={tag.tagName} value={tag.tagName}>
              {tag.tagName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
