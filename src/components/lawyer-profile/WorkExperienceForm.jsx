import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit } from "lucide-react";

const WorkExperienceForm = ({ 
  workExperiences = [], 
  onSave, 
  onCancel, 
  submitting = false,
  user 
}) => {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState({
    law_firm: "",
    position: "",
    start_date: "",
    end_date: "",
    description: ""
  });

  useEffect(() => {
    setExperiences(workExperiences || []);
  }, [workExperiences]);

  const resetForm = () => {
    setFormData({
      law_firm: "",
      position: "",
      start_date: "",
      end_date: "",
      description: ""
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
    const exp = experiences[index];
    setFormData({
      law_firm: exp.law_firm || "",
      position: exp.position || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      description: exp.description || ""
    });
    setShowForm(true);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (editingIndex >= 0) {
      // Edit existing
      const newExperiences = [...experiences];
      newExperiences[editingIndex] = { ...formData };
      setExperiences(newExperiences);
    } else {
      // Add new
      setExperiences([...experiences, { ...formData }]);
    }
    
    resetForm();
  };

  const handleSaveAndNext = () => {
    onSave(experiences);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Work Experience</h2>
            <p className="text-muted-foreground">
              Add your professional work experience details.
            </p>
          </div>

          {/* Existing experiences list */}
          {experiences.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Current Work Experiences</h3>
              {experiences.map((exp, index) => (
                <Card key={index} className="p-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{exp.position}</h4>
                      <p className="text-muted-foreground">{exp.law_firm}</p>
                      <p className="text-sm text-muted-foreground">
                        {exp.start_date} - {exp.end_date}
                      </p>
                      <p className="text-sm mt-2">{exp.description}</p>
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
                Add Work Experience
              </Button>
            </div>
          )}

          {/* Form for adding/editing */}
          {showForm && (
            <Card className="p-4 mb-6">
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Law Firm / Company</Label>
                  <Input
                    name="law_firm"
                    value={formData.law_firm}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label>Position</Label>
                  <Input
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="md:col-span-2 flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingIndex >= 0 ? "Update" : "Add"} Experience
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
            <Button onClick={handleSaveAndNext} disabled={submitting}>
              {submitting ? "Saving..." : "Save and Next"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkExperienceForm;