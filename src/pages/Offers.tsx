import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Eye, 
  Clock, 
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Send,
  FileText,
  MoreHorizontal
} from "lucide-react";
import { mockOffers } from "@/lib/mockData";
import { Offer } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Offers() {
  const [offers, setOffers] = useState(mockOffers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusIcon = (status: Offer['status']) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'sent': return <Send className="w-4 h-4 text-blue-600" />;
      case 'viewed': return <Eye className="w-4 h-4 text-yellow-600" />;
      case 'expired': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Offer['status']) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'sent': return 'secondary';
      case 'viewed': return 'outline';
      case 'expired': return 'outline';
      default: return 'outline';
    }
  };

  const OfferCard = ({ offer }: { offer: Offer }) => {
    const daysUntilExpiry = Math.ceil((new Date(offer.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const isExpiring = daysUntilExpiry <= 3 && daysUntilExpiry > 0;
    const isExpired = daysUntilExpiry <= 0;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={offer.candidate.avatar} />
                <AvatarFallback>
                  {offer.candidate.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">{offer.candidate.name}</CardTitle>
                <CardDescription>{offer.jobTitle}</CardDescription>
                <div className="flex items-center mt-2">
                  <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    ${offer.salary.amount.toLocaleString()} {offer.salary.currency} / {offer.salary.frequency}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusColor(offer.status)} className="flex items-center gap-1">
                {getStatusIcon(offer.status)}
                {offer.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Edit Offer
                  </DropdownMenuItem>
                  {offer.status === 'draft' && (
                    <DropdownMenuItem>
                      <Send className="w-4 h-4 mr-2" />
                      Send Offer
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Offer Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Start Date:</span>
              <div className="font-medium">
                {new Date(offer.startDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <div className="font-medium">
                {new Date(offer.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Benefits */}
          {offer.benefits.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Benefits:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {offer.benefits.slice(0, 3).map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
                {offer.benefits.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{offer.benefits.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Expiry Warning */}
          {(isExpiring || isExpired) && (
            <div className={`p-3 rounded-lg ${isExpired ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <div className="flex items-center">
                <Clock className={`w-4 h-4 mr-2 ${isExpired ? 'text-red-600' : 'text-yellow-600'}`} />
                <span className={`text-sm font-medium ${isExpired ? 'text-red-800' : 'text-yellow-800'}`}>
                  {isExpired ? 'Offer expired' : `Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`}
                </span>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Timeline:</h5>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Created {new Date(offer.createdAt).toLocaleDateString()}
              </div>
              {offer.sentAt && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Sent {new Date(offer.sentAt).toLocaleDateString()}
                </div>
              )}
              {offer.respondedAt && (
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${offer.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {offer.status === 'accepted' ? 'Accepted' : 'Rejected'} {new Date(offer.respondedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {offer.status === 'draft' && (
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                <Send className="w-3 h-3 mr-1" />
                Send Offer
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const CreateOfferDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Offer</DialogTitle>
          <DialogDescription>
            Create a new job offer for a candidate
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidate">Candidate</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sarah Chen</SelectItem>
                  <SelectItem value="2">Marcus Johnson</SelectItem>
                  <SelectItem value="3">Elena Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job">Job Position</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Senior Frontend Developer</SelectItem>
                  <SelectItem value="2">Backend Engineer</SelectItem>
                  <SelectItem value="3">Full Stack Developer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Amount</Label>
              <Input id="salary" type="number" placeholder="120000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select defaultValue="yearly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Offer Expires</Label>
              <Input id="expiryDate" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea 
              id="terms" 
              placeholder="Enter the terms and conditions for this offer..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits (comma-separated)</Label>
            <Input id="benefits" placeholder="Health Insurance, 401k, Remote Work, PTO" />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button>Create Offer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const totalOffers = offers.length;
  const pendingOffers = offers.filter(o => ['sent', 'viewed'].includes(o.status)).length;
  const acceptedOffers = offers.filter(o => o.status === 'accepted').length;
  const rejectedOffers = offers.filter(o => o.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Offers & Contracts</h1>
          <p className="text-muted-foreground">
            Manage job offers and track candidate responses
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Offer
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Offers</CardTitle>
            <div className="text-2xl font-bold">{totalOffers}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Response</CardTitle>
            <div className="text-2xl font-bold text-yellow-600">{pendingOffers}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
            <div className="text-2xl font-bold text-green-600">{acceptedOffers}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            <div className="text-2xl font-bold text-red-600">{rejectedOffers}</div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="recent">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Offer Listings */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      <CreateOfferDialog />
    </div>
  );
}