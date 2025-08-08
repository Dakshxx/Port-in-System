import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MessageSquare,
  Star,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { complaintApi } from '@/services/api'; // Import the complaint API

export default function Complaint() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    msisdn: '',
    category: '', // This will be the 'reason' in the backend
    priority: '',
    subject: '',
    description: '',
    rating: '',
    improvementAreas: [] as string[],
    followUp: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send data to the backend
      await complaintApi.submitComplaint({
        reason: formData.category, // Map 'category' to 'reason' for the backend
        // You can add more fields to your backend model if needed
      });

      toast({
        title: "Complaint Submitted Successfully",
        description: `Your complaint has been registered.`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        msisdn: '',
        category: '',
        priority: '',
        subject: '',
        description: '',
        rating: '',
        improvementAreas: [],
        followUp: false
      });

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting your complaint.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImprovementAreaChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      improvementAreas: checked
        ? [...prev.improvementAreas, area]
        : prev.improvementAreas.filter(a => a !== area)
    }));
  };

  const improvementAreas = [
    'Navigation & User Interface',
    'Page Loading Speed',
    'Search & Filter Functionality',
    'Data Table Display',
    'Mobile Responsiveness',
    'Color Scheme & Design',
    'System Reliability',
    'Feature Accessibility'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange/5 via-background to-warning/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange to-warning p-6 text-white">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">User Experience Complaint</h1>
              <p className="text-white/90 mt-1">Help us improve your experience with the TelePort MNP system</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-info/5 to-info/10 border-info/20">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-info mx-auto mb-2" />
                <div className="text-2xl font-bold text-info">24h</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-success">95%</div>
                <div className="text-sm text-muted-foreground">Resolution Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-warning">4.2</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple/5 to-purple/10 border-purple/20">
              <CardContent className="p-4 text-center">
                <MessageSquare className="w-8 h-8 text-purple mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple">1,247</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange/5 to-warning/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange" />
                Submit Your Complaint
              </CardTitle>
              <CardDescription>
                Your feedback helps us improve the system. Please provide detailed information about your experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="msisdn">Related MSISDN (if applicable)</Label>
                      <Input
                        id="msisdn"
                        value={formData.msisdn}
                        onChange={(e) => setFormData(prev => ({...prev, msisdn: e.target.value}))}
                        placeholder="Enter MSISDN"
                      />
                    </div>
                  </div>
                </div>

                {/* Complaint Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Complaint Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complaint category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ui-ux">User Interface & Experience</SelectItem>
                          <SelectItem value="performance">System Performance</SelectItem>
                          <SelectItem value="functionality">Functionality Issues</SelectItem>
                          <SelectItem value="data-accuracy">Data Accuracy</SelectItem>
                          <SelectItem value="navigation">Navigation Problems</SelectItem>
                          <SelectItem value="mobile">Mobile Experience</SelectItem>
                          <SelectItem value="accessibility">Accessibility</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level *</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({...prev, priority: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-success"></div>
                              Low - Minor inconvenience
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-warning"></div>
                              Medium - Affects productivity
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-destructive"></div>
                              High - Blocks work
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({...prev, subject: e.target.value}))}
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                      placeholder="Please provide a detailed description of the issue, including steps to reproduce if applicable"
                      rows={5}
                      required
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning" />
                    Overall System Rating
                  </h3>
                  <RadioGroup
                    value={formData.rating}
                    onValueChange={(value) => setFormData(prev => ({...prev, rating: value}))}
                    className="flex flex-wrap gap-4"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                        <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1">
                          {rating}
                          <Star className={`w-4 h-4 ${rating <= 2 ? 'text-destructive' : rating <= 3 ? 'text-warning' : 'text-success'}`} />
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Improvement Areas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Areas for Improvement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {improvementAreas.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={formData.improvementAreas.includes(area)}
                          onCheckedChange={(checked) => handleImprovementAreaChange(area, checked as boolean)}
                        />
                        <Label htmlFor={area} className="text-sm">{area}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow-up */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followUp"
                    checked={formData.followUp}
                    onCheckedChange={(checked) => setFormData(prev => ({...prev, followUp: checked as boolean}))}
                  />
                  <Label htmlFor="followUp">I would like to receive follow-up communications about this complaint</Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange to-warning hover:from-orange/90 hover:to-warning/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Complaint
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}