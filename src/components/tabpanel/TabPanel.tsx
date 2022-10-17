import Box from '@mui/material/Box'

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export default function TabPanel (props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div 
            role="tabpanel" 
            hidden={value !== index} 
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p:3 }}>
                    {children}
                </Box>
            )}
        </div>
    )
}