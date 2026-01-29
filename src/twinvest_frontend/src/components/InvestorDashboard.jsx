import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { twinvest_backend } from "@/lib/icp";
import { useToast } from "./ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Clock, Star, Eye, ShoppingCart, BarChart3, Wallet } from "lucide-react";

export const InvestorDashboard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newInvestor, setNewInvestor] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");

  // Fetch investments
  const { data: investments, isLoading, isError } = useQuery({
    queryKey: ["investments"],
    queryFn: () => twinvest_backend.getInvestments(),
  });

  // Add investment mutation
  const addInvestmentMutation = useMutation({
    mutationFn: ({ investor, amount }) => twinvest_backend.addInvestment(investor, amount),
    onSuccess: () => {
      queryClient.invalidateQueries(["investments"]);
      toast({
        title: "Investment Added!",
        description: "Your new investment has been successfully recorded.",
      });
      setNewInvestor("");
      setNewAmount("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add investment: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleAddInvestment = (e) => {
    e.preventDefault();
    if (!newInvestor || !newAmount) {
      toast({
        title: "Missing Information",
        description: "Please provide both investor name and amount.",
        variant: "destructive",
      });
      return;
    }
    addInvestmentMutation.mutate({ investor: newInvestor, amount: BigInt(newAmount) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Investor Portal
          </h1>
          <p className="text-muted-foreground">Discover and invest in tokenized invoice NFTs</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>

      {/* Investment Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$847,320</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
            <p className="text-xs text-muted-foreground">Invoice NFTs owned</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Returns</CardTitle>
            <BarChart3 className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$92,450</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ROI</CardTitle>
            <Star className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2%</div>
            <p className="text-xs text-muted-foreground">Annual return rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="marketplace" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          <TabsTrigger value="secondary">Secondary Market</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Available Invoice NFTs</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Sort</Button>
            </div>
          </div>

          {/* Add Investment Form */}
          <Card className="p-4">
            <CardTitle className="mb-4">Add New Investment</CardTitle>
            <form onSubmit={handleAddInvestment} className="space-y-4">
              <div>
                <label htmlFor="investor" className="block text-sm font-medium text-muted-foreground">Investor Name</label>
                <input
                  type="text"
                  id="investor"
                  value={newInvestor}
                  onChange={(e) => setNewInvestor(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                  placeholder="e.g., Alice Smith"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground">Amount (Nat)</label>
                <input
                  type="number"
                  id="amount"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                  placeholder="e.g., 1000"
                />
              </div>
              <Button type="submit" variant="gradient" disabled={addInvestmentMutation.isLoading}>
                {addInvestmentMutation.isLoading ? "Adding..." : "Add Investment"}
              </Button>
            </form>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Tech Services</Badge>
                    <Badge variant="outline" className="text-success">AAA Rated</Badge>
                  </div>
                  <CardTitle className="text-lg">Invoice #INV-{1000 + item}</CardTitle>
                  <CardDescription>TechCorp Solutions • Due in 45 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Invoice Value</span>
                    <span className="font-semibold">${(25000 + item * 1000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Purchase Price</span>
                    <span className="font-semibold text-primary">${(22000 + item * 900).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expected ROI</span>
                    <span className="font-semibold text-success">{(12 + item).toFixed(1)}%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 gap-1">
                      <Eye className="h-3 w-3" />
                      Details
                    </Button>
                    <Button size="sm" variant="gradient" className="flex-1 gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      Invest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <h3 className="text-lg font-semibold">My Investment Portfolio</h3>
          
          {isLoading && <p>Loading investments...</p>}
          {isError && <p className="text-red-500">Error loading investments.</p>}
          {investments && investments.length === 0 && <p>No investments found.</p>}

          <div className="grid gap-4">
            {investments && investments.map((investment) => (
              <Card key={investment.id.toString()}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">Investment ID: {investment.id.toString()}</h4>
                      <p className="text-sm text-muted-foreground">Investor: {investment.investor}</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount</span>
                      <p className="font-semibold">${investment.amount.toLocaleString()}</p>
                    </div>
                    {/* Add more details if available in your Investment type */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="secondary" className="space-y-4">
          <h3 className="text-lg font-semibold">Secondary Market Trading</h3>
          <p className="text-muted-foreground">Trade invoice NFTs with other investors before maturity</p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">For Sale</Badge>
                    <Badge variant="secondary">{(15 - item * 2)} days left</Badge>
                  </div>
                  <CardTitle className="text-lg">Invoice NFT #{7000 + item}</CardTitle>
                  <CardDescription>Listed by Investor #{item}234</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Asking Price</span>
                    <span className="font-semibold">${(19000 + item * 800).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Face Value</span>
                    <span className="font-semibold">${(22000 + item * 1000).toLocaleString()}</span>
                  </div>
                  <Button variant="gradient" className="w-full">
                    Purchase
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Analytics</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Invested</span>
                    <span className="font-semibold">$650,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Returns</span>
                    <span className="font-semibold text-success">$742,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Profit</span>
                    <span className="font-semibold text-success">$92,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-semibold">96.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Low Risk</span>
                      <span className="text-sm">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Medium Risk</span>
                      <span className="text-sm">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">High Risk</span>
                      <span className="text-sm">5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};