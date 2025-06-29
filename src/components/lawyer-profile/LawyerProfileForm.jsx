import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";

const LawyerProfileForm = ({ 
  formData, 
  setFormData, 
  handleChange, 
  handleSubmit, 
  submitting, 
  dropdowns, 
  onCancel,
  isEditing = false,
  photoChanged,
  setPhotoChanged
}) => {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [feeError, setFeeError] = useState("");

  const handleFeeChange = (e) => {
    const value = e.target.value;
    
    if (value === "") {
      setFeeError("");
      handleChange(e);
      return;
    }
    
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
      setFeeError("Please enter a valid fee amount");
      handleChange(e);
      return;
    }
    
    if (numericValue > 0 && numericValue < 500) {
      setFeeError("Minimum fee must be ₹500 or higher");
    } else {
      setFeeError("");
    }
    
    handleChange(e);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (.png, .jpg, .jpeg)');
        return;
      }

      // Validate file size (optional - limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      setPhotoFile(file);
      setPhotoChanged(true);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData({ ...formData, photo: file });
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoChanged(true);
    setFormData({ ...formData, photo: "" });
    const fileInput = document.getElementById('photo-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  React.useEffect(() => {
    if (isEditing && formData.photo && typeof formData.photo === 'string' && !photoPreview) {
      setPhotoPreview(formData.photo);
    }
  }, [formData.photo, isEditing, photoPreview]);

  const isFormValid = () => {
    const requiredFields = [
      'phone', 'city', 'law_type', 'fee', 'total_experience', 
      'practice_area', 'languages', 'about', 'address'
    ];
    
    const fieldsValid = requiredFields.every(field => formData[field]);
    
    const feeValue = parseFloat(formData.fee);
    const feeValid = !isNaN(feeValue) && feeValue >= 500;
    
    let photoValid = false;
    if (isEditing) {
      photoValid = (formData.photo && !photoChanged) || (photoChanged && photoFile);
    } else {
      photoValid = photoFile || formData.photo;
    }
    
    return fieldsValid && feeValid && photoValid;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Check fee validation specifically
    const feeValue = parseFloat(formData.fee);
    if (isNaN(feeValue) || feeValue < 500) {
      alert('Minimum fee must be ₹500 or higher. Please update your fee to continue.');
      return;
    }
    
    if (!isFormValid()) {
      if (isEditing) {
        if (photoChanged && !photoFile) {
          alert('Please upload a new profile photo or keep the existing one. Photo is required.');
          return;
        }
      } else {
        if (!photoFile && !photoPreview && !formData.photo) {
          alert('Please upload a profile photo. This field is required.');
          return;
        }
      }
      alert('Please fill in all required fields including uploading a profile photo.');
      return;
    }
    
    handleSubmit(e);
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {isEditing ? "Edit Profile" : "Create Profile"}
            </h2>
            <p className="text-muted-foreground">
              {isEditing ? "Update your profile information below." : "Fill in your details to create your lawyer profile."}
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label>Phone *</Label><Input name="phone" value={formData.phone} onChange={handleChange} required /></div>

            <div>
              <Label>City *</Label>
              <Select value={formData.city} onValueChange={(val) => setFormData({ ...formData, city: val })} required>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>
                  {dropdowns.cities.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Law Type *</Label>
              <Select value={formData.law_type} onValueChange={(val) => setFormData({ ...formData, law_type: val })} required>
                <SelectTrigger><SelectValue placeholder="Select law type" /></SelectTrigger>
                <SelectContent>
                  {dropdowns.lawTypes.map((law) => <SelectItem key={law.id} value={law.id.toString()}>{law.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Fee * (Minimum ₹500)</Label>
              <Input 
                name="fee" 
                type="number"
                min="500"
                step="50"
                value={formData.fee} 
                onChange={handleFeeChange} 
                placeholder="Enter fee (minimum ₹500)"
                required 
                className={feeError ? "border-red-500 focus:border-red-500" : ""}
              />
              {feeError && (
                <p className="text-sm text-red-500 mt-1">{feeError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Your consultation fee must be at least ₹500
              </p>
            </div>

            <div>
              <Label>Experience *</Label>
              <Select value={formData.total_experience} onValueChange={(val) => setFormData({ ...formData, total_experience: val })} required>
                <SelectTrigger><SelectValue placeholder="Select experience" /></SelectTrigger>
                <SelectContent>
                  {dropdowns.experiences.map((exp) => <SelectItem key={exp.id} value={exp.id.toString()}>{exp.years}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Practice Area *</Label>
              <Select value={formData.practice_area} onValueChange={(val) => setFormData({ ...formData, practice_area: val })} required>
                <SelectTrigger><SelectValue placeholder="Select practice area" /></SelectTrigger>
                <SelectContent>
                  {dropdowns.practiceAreas.map((a) => <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Languages *</Label>
              <Select value={formData.languages} onValueChange={(val) => setFormData({ ...formData, languages: val })} required>
                <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                <SelectContent>
                  {dropdowns.languages.map((lang) => <SelectItem key={lang.id} value={lang.id.toString()}>{lang.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>About *</Label>
              <Textarea name="about" value={formData.about} onChange={handleChange} rows={4} required />
            </div>

            <div className="md:col-span-2">
              <Label>Address *</Label>
              <Textarea name="address" value={formData.address} onChange={handleChange} rows={3} required />
            </div>

            <div className="md:col-span-2">
              <Label>Website</Label>
              <Input name="website" value={formData.website || ""} onChange={handleChange} placeholder="Enter your website (optional)" />
            </div>

            <div className="md:col-span-2">
              <Label className="text-base font-medium">
                Profile Photo *
                <span className="text-red-500 ml-1">Required</span>
              </Label>
              <div className="mt-2">
                {photoPreview ? (
                  <div className="relative inline-block">
                    <img 
                      src={photoPreview} 
                      alt="Profile preview" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors bg-red-50">
                    <Upload className="h-12 w-12 mx-auto text-red-400 mb-4" />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <span className="text-sm text-red-600 font-medium">Click to upload a photo (Required)</span>
                      <br />
                      <span className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</span>
                    </label>
                  </div>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                  required={!isEditing || !formData.photo}
                />
                {!photoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload').click()}
                    className="mt-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Photo (Required)
                  </Button>
                )}
                {!photoPreview && !isEditing && (
                  <p className="text-xs text-red-500 mt-1">
                    A profile photo is required to complete your profile
                  </p>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex gap-4 justify-end">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={submitting || !isFormValid()}
                className={!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}
              >
                {submitting ? "Saving..." : "Save and Next"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LawyerProfileForm;