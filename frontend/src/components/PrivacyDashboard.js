import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import SecurityIcon from '@mui/icons-material/Security';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const PrivacyDashboard = () => {
  const [consents, setConsents] = useState({
    essential: true, // Cannot be disabled
    analytics: false,
    personalization: true,
    communication: false,
    marketing: false
  });
  
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('idle');
  const [dataProcessingSummary, setDataProcessingSummary] = useState(null);

  useEffect(() => {
    // Load user's current consent settings
    loadConsentSettings();
    loadDataProcessingSummary();
  }, []);

  const loadConsentSettings = async () => {
    try {
      // In a real app, this would fetch from the backend
      const savedConsents = localStorage.getItem('userConsents');
      if (savedConsents) {
        setConsents({ ...consents, ...JSON.parse(savedConsents) });
      }
    } catch (error) {
      console.error('Error loading consent settings:', error);
    }
  };

  const loadDataProcessingSummary = async () => {
    try {
      // Mock data - in real app, fetch from backend
      setDataProcessingSummary({
        dataCategories: ['Profile Data', 'Learning Progress', 'Usage Analytics'],
        processingPurposes: ['Education', 'Progress Tracking', 'Platform Improvement'],
        retentionPeriods: [
          { type: 'Profile Data', days: 2555 }, // 7 years
          { type: 'Learning Analytics', days: 730 }, // 2 years
          { type: 'Usage Data', days: 365 } // 1 year
        ],
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading data processing summary:', error);
    }
  };

  const handleConsentChange = async (consentType, value) => {
    if (consentType === 'essential') return; // Cannot change essential consent

    const newConsents = { ...consents, [consentType]: value };
    setConsents(newConsents);

    try {
      // Save to backend
      localStorage.setItem('userConsents', JSON.stringify(newConsents));
      
      // In a real app, you would call the backend API
      console.log(`Consent updated: ${consentType} = ${value}`);
    } catch (error) {
      console.error('Error updating consent:', error);
    }
  };

  const handleDataExport = async () => {
    setExportStatus('processing');
    setExportProgress(0);
    
    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // In a real app, this would call the backend API
      setTimeout(() => {
        clearInterval(progressInterval);
        setExportProgress(100);
        setExportStatus('completed');
        
        // Simulate file download
        const exportData = {
          profile: { name: 'John Doe', email: 'john@example.com' },
          progress: { overallProgress: 65, completedActivities: 12 },
          exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_learning_data.json';
        a.click();
        URL.revokeObjectURL(url);
        
        setTimeout(() => {
          setExportDialogOpen(false);
          setExportStatus('idle');
          setExportProgress(0);
        }, 2000);
      }, 2000);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      setExportStatus('error');
    }
  };

  const handleAccountDeletion = async () => {
    try {
      // In a real app, this would call the backend API
      console.log('Account deletion requested');
      alert('Account deletion request submitted. You will receive a confirmation email within 24 hours.');
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error requesting account deletion:', error);
    }
  };

  const consentDescriptions = {
    essential: {
      title: 'Essential Cookies & Data',
      description: 'Required for basic functionality, authentication, and security.',
      canDisable: false,
      impact: 'Cannot use the platform without this.'
    },
    analytics: {
      title: 'Analytics & Performance',
      description: 'Helps us understand how you use the platform to improve performance.',
      canDisable: true,
      impact: 'Platform improvements may be less relevant to your usage patterns.'
    },
    personalization: {
      title: 'Personalization',
      description: 'Customize your learning experience based on your progress and preferences.',
      canDisable: true,
      impact: 'You\'ll receive generic recommendations instead of personalized ones.'
    },
    communication: {
      title: 'Educational Communications',
      description: 'Notifications about your progress, achievements, and important updates.',
      canDisable: true,
      impact: 'You won\'t receive progress updates or achievement notifications.'
    },
    marketing: {
      title: 'Marketing Communications',
      description: 'Information about new features, courses, and educational content.',
      canDisable: true,
      impact: 'You won\'t hear about new educational opportunities that might interest you.'
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PrivacyTipIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4">Privacy & Data Settings</Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Your privacy matters to us. Control how your data is used and learn about our data practices.
          These settings comply with GDPR and other privacy regulations.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Consent Controls */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Processing Consent
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose how your data can be processed. You can change these settings at any time.
              </Typography>

              {Object.entries(consentDescriptions).map(([key, desc]) => (
                <Box key={key} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {desc.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {desc.description}
                      </Typography>
                      {!desc.canDisable && (
                        <Chip 
                          label="Required" 
                          size="small" 
                          color="primary" 
                          sx={{ mb: 1 }}
                        />
                      )}
                    </Box>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={consents[key]}
                          onChange={(e) => handleConsentChange(key, e.target.checked)}
                          disabled={!desc.canDisable}
                        />
                      }
                      label=""
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  {!consents[key] && desc.canDisable && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        Impact: {desc.impact}
                      </Typography>
                    </Alert>
                  )}
                  
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Data Rights */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Data Rights
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => setExportDialogOpen(true)}
              >
                Export My Data
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                fullWidth
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete My Account
              </Button>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Under GDPR, you have the right to access, rectify, erase, and port your data.
              </Typography>
            </CardContent>
          </Card>

          {/* Data Processing Summary */}
          {dataProcessingSummary && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Data We Process
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Data Categories:
                </Typography>
                <List dense>
                  {dataProcessingSummary.dataCategories.map((category, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary={category} />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Processing Purposes:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {dataProcessingSummary.processingPurposes.map((purpose, index) => (
                    <Chip 
                      key={index}
                      label={purpose}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date(dataProcessingSummary.lastUpdated).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Export Data Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Your Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            You can download all your personal data in JSON format. This includes your profile, 
            learning progress, and activity history.
          </Typography>
          
          {exportStatus === 'processing' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Preparing your data export...
              </Typography>
              <LinearProgress variant="determinate" value={exportProgress} />
            </Box>
          )}
          
          {exportStatus === 'completed' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Your data has been exported and downloaded!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDataExport} 
            variant="contained"
            disabled={exportStatus === 'processing'}
          >
            {exportStatus === 'processing' ? 'Exporting...' : 'Export Data'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon color="error" sx={{ mr: 1 }} />
            Delete Account
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              This action cannot be undone.
            </Typography>
          </Alert>
          
          <Typography variant="body2" paragraph>
            Deleting your account will:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Permanently delete your profile and personal information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Remove all your learning progress and achievements" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Anonymize your usage data for platform improvement" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Prevent future access to your account" />
            </ListItem>
          </List>
          
          <Typography variant="body2" paragraph>
            If you're sure you want to proceed, we'll send you a confirmation email to complete the deletion.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAccountDeletion} 
            color="error" 
            variant="contained"
          >
            Request Account Deletion
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PrivacyDashboard;