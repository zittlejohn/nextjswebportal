import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import ApiIcon from '@mui/icons-material/Api';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';

const WmsIntegrationsPage = () => {
    return (
        <Box p={4} mx="auto">
            <Typography variant="h4" gutterBottom>
                📦 WMS Integrations
            </Typography>

            <Typography variant="body1" paragraph>
                At FLSA, we understand that every business operates differently — which is why our Warehouse Management System (WMS) is built for <strong>flexibility, reliability, and ease of integration</strong>. Whether you're looking to automate workflows, improve data accuracy, or speed up order processing, we make it simple to connect your systems to ours.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <List>
                        <ListItem>
                            <ListItemIcon sx={{ mr: 2 }}>
                                <ApiIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="API Integration"
                                secondary="REST API for real-time connectivity. Ideal for ERPs, CRMs, or eCommerce platforms."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{ mr: 2 }}>
                                <StorageIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="File-Based Integration"
                                secondary="Supports CSV, XML, or TXT files via FTP or secure SFTP. Perfect for batch processing."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{ mr: 2 }}>
                                <BuildIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Custom Solutions"
                                secondary="Tailored workflows, hybrid API+file sync, and flexible data mapping options."
                            />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            <Typography variant="h6" gutterBottom>
                🔒 Security Comes First
            </Typography>
            <List>
                <ListItem>
                    <ListItemIcon>
                        <LockIcon color="action" />
                    </ListItemIcon>
                    <ListItemText primary="Encrypted SFTP channels" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <LockIcon color="action" />
                    </ListItemIcon>
                    <ListItemText primary="Token-based API authentication" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <LockIcon color="action" />
                    </ListItemIcon>
                    <ListItemText primary="IP whitelisting and access control" />
                </ListItem>
            </List>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>
                🛠️ Ready to Connect?
            </Typography>
            <Typography variant="body1">
                Whether you're a tech-savvy business looking for a RESTful API or prefer a more traditional file-based setup, we’ve got you covered.
                <br /><br />
                <strong>Let’s discuss the best integration option for your operations.</strong> Our team is happy to guide you through the onboarding process and provide technical documentation or sandbox access.
                <br /><br />
                Contact<strong> dan@flsa.com.au</strong> to get started.
            </Typography>
        </Box>
    );
};

export default WmsIntegrationsPage;
