// Icons.tsx
import CustomIcon from './CustomIcon';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';

export const DownloadCustomIcon = () => (
    <CustomIcon alt="Download CSV">
        <DownloadIcon />
    </CustomIcon>
);

export const SearchCustomIcon = () => (
    <CustomIcon alt="Search">
        <SearchIcon />
    </CustomIcon>
);

export const PrintCustomIcon = () => (
    <CustomIcon alt="Print">
        <PrintIcon />
    </CustomIcon>
);

export const ColumnViewCustomIcon = () => (
    <CustomIcon alt="Column Views">
        <ViewColumnIcon />
    </CustomIcon>
);

export const FilterTableCustomIcon = () => (
    <CustomIcon alt="Filter Table">
        <FilterListIcon />
    </CustomIcon>
);
