import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';

const CssTextField = withStyles({
  root: {
    '& label': {
      color: 'floralwhite',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: 'floralwhite',
    },
    '& label.Mui-focused': {
      color: 'lightblue',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'lightblue',
    },
    '& input': {
      color: 'floralwhite',
    },
    '& .MuiInputBase-root': {
      color: 'floralwhite',
    },
    '& .MuiFormLabel-root': {
      color: 'floralwhite',
    },
    '& .MuiSelect-select.MuiSelect-select': {
      color: 'floralwhite',
    },
  },
})(TextField);

export default CssTextField;
