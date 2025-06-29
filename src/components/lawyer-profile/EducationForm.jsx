import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const API_BASE = "https://backend.xpertslaw.com";

const fetchWithRetry = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        const text = await response.text();
        if (text.includes("86400")) throw new Error("Rate limited for 24 hours");
        await new Promise((res) => setTimeout(res, Math.pow(2, i) * 1000));
        continue;
      }
      return response;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
};

const EducationForm = ({ 
  educations = [], 
  onSave, 
  onCancel, 
  submitting = false,
  user,
  isEditing = false
}) => {
  const { toast } = useToast();
  const [educationList, setEducationList] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    setEducationList(educations || []);
  }, [educations]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const opts = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await fetchWithRetry(`${API_BASE}/lawyers/institutions/`, opts);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Institutions API response:', result); // Debug log
        
        const institutionsData = result?.data?.data || result?.data || result || [];
        setInstitutions(institutionsData);
        
        if (institutionsData.length === 0) {
          console.warn('No institutions found in response');
        }
      } catch (err) {
        console.error('Error fetching institutions:', err);
        toast({ title: "Error", description: "Failed to load institutions.", variant: "destructive" });
      } finally {
        setLoadingInstitutions(false);
      }
    };

    if (user?.token) {
      fetchInstitutions();
    }
  }, [user, toast]);

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      start_date: "",
      end_date: ""
    });
    setShowForm(false);
    setEditingIndex(-1);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
    setEditingIndex(-1);
  };

  const handleEdit = (index) => {
    const edu = educationList[index];
    setFormData({
      institution: edu.institution?.id?.toString() || edu.institution?.toString() || "",
      degree: edu.degree || "",
      start_date: edu.start_date || "",
      end_date: edu.end_date || ""
    });
    setShowForm(true);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const newEducationList = educationList.filter((_, i) => i !== index);
    setEducationList(newEducationList);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.institution || !formData.degree || !formData.start_date || !formData.end_date) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    
    const selectedInstitution = institutions.find(inst => inst.id.toString() === formData.institution);
    
    if (!selectedInstitution) {
      toast({ title: "Error", description: "Please select a valid institution.", variant: "destructive" });
      return;
    }
    
    const educationData = {
      institution: selectedInstitution,
      degree: formData.degree,
      start_date: formData.start_date,
      end_date: formData.end_date
    };
    
    if (editingIndex >= 0) {
      // Edit existing
      const newEducationList = [...educationList];
      newEducationList[editingIndex] = educationData;
      setEducationList(newEducationList);
    } else {
      // Add new
      setEducationList([...educationList, educationData]);
    }
    
    resetForm();
  };

  const handleSaveAndComplete = () => {
    onSave(educationList);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getInstitutionName = (institution) => {
    if (typeof institution === 'object' && institution?.name) {
      return institution.name;
    }
    if (typeof institution === 'string') {
      return institution;
    }
    const foundInstitution = institutions.find(inst => inst.id === institution);
    return foundInstitution ? foundInstitution.name : 'Unknown Institution';
  };

  if (loadingInstitutions) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading institutions...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (institutions.length === 0) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No institutions available. Please contact support.</p>
              <div className="flex gap-4 justify-center mt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Go Back
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Education</h2>
            <p className="text-muted-foreground">
              Add your educational background and qualifications.
            </p>
          </div>

          {/* Existing education list */}
          {educationList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Current Education Details</h3>
              {educationList.map((edu, index) => (
                <Card key={index} className="p-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-muted-foreground">
                        {getInstitutionName(edu.institution)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {edu.start_date} - {edu.end_date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Add new button */}
          {!showForm && (
            <div className="mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddNew}
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
          )}

          {/* Form for adding/editing */}
          {showForm && (
            <Card className="p-4 mb-6 border-2 border-dashed border-blue-200 bg-blue-50/50">
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Institution *</Label>
                  <Select 
                    value={formData.institution} 
                    onValueChange={(val) => setFormData({ ...formData, institution: val })}
                    required
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select institution" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions.map((inst) => (
                        <SelectItem key={inst.id} value={inst.id.toString()}>
                          {inst.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Degree *</Label>
                  <Input
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g., Bachelor of Laws (LLB)"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Start Date *
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    End Date *
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <Button type="button" variant="outline" onClick={resetForm} className="px-6">
                    Cancel
                  </Button>
                  <Button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700">
                    {editingIndex >= 0 ? "Update" : "Add"} Education
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSaveAndComplete} disabled={submitting}>
              {submitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Profile" : "Create Profile")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EducationForm;