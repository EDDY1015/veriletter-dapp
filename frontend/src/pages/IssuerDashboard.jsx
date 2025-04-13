import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Divider,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Issue from "./Issue";
import { BarChart } from "@mui/x-charts/BarChart";
import useIssuedLetters from "../hooks/useIssuedLetters";

function IssuerDashboard({ user }) {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [quota, setQuota] = useState({ total: 0, used: 0 });
  const [issuerId, setIssuerId] = useState("");

  const { letters, loading } = useIssuedLetters(user?.email, issuerId);
  console.log("📡 Using issuerId:", issuerId);

  useEffect(() => {
    const fetchQuota = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(`http://localhost:5001/issuer/${user.email}`);
        const data = await res.json();
        setQuota({ total: data.quotaLimit, used: data.quotaUsed });
        setIssuerId(data.issuerId);
      } catch (err) {
        console.error("Failed to load quota from backend", err);
      }
    };
    fetchQuota();
  }, [user]);

  const rows = letters.map((l, i) => ({
    id: i + 1,
    name: `${l.firstName || ""} ${l.lastName || ""}`.trim(),
    passport: l.passport || "(unknown)",
    fileHash: l.fileHash,
    expiry: new Date(l.expiryDate * 1000).toISOString().slice(0, 10),
  }));

  const filteredRows = rows.filter((row) => {
    const searchLower = search.toLowerCase();
    return (
      row.name.toLowerCase().includes(searchLower) ||
      row.passport.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "passport", headerName: "Passport/ID", flex: 1 },
    { field: "fileHash", headerName: "File Hash", flex: 1 },
    { field: "expiry", headerName: "Expiry", width: 120 },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🎓 Issuer Dashboard
      </Typography>

      <Paper elevation={3} sx={{ mt: 4 }}>
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          variant="fullWidth"
        >
          <Tab label="Issued Letters" />
          <Tab label="Analytics" />
          <Tab label="Issue Letter" />
        </Tabs>

        <Divider />

        <Box p={3}>
          {tab === 0 && (
            <>
              <TextField
                fullWidth
                label="Search by Name or Passport/ID"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
              />
              {loading ? (
                <Typography>Loading...</Typography>
              ) : (
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  autoHeight
                  disableRowSelectionOnClick
                  pageSize={5}
                />
              )}
            </>
          )}

          {tab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">📦 Subscription Usage</Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                      {quota.used} / {quota.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Letters issued so far
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📊 Letters Issued (Mock Data)
                    </Typography>
                    <BarChart
                      xAxis={[{ scaleType: "band", data: ["Jan", "Feb", "Mar", "Apr"] }]}
                      series={[{ data: [1, 3, 4, 2] }]}
                      width={400}
                      height={250}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {tab === 2 && (
            <Issue
              canIssue={quota.used < quota.total}
              email={user?.email}
              issuerId={issuerId}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default IssuerDashboard;
