import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { serverUrl } from "../helpers/constants";
import { LinkGroup, Link } from "../interface/linkGroup";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  ExternalLink,
  Copy,
  Check,
  Link2,
  Save,
  X,
  Image,
  Upload,
  Trash2,
  Search,
  Grid,
  List,
} from "lucide-react";
import { CircularProgress } from "@mui/material";

const GroupLinks: React.FC = () => {
  const [linkGroups, setLinkGroups] = useState<LinkGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<LinkGroup | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    profileImage: "",
    links: [] as Link[],
  });

  const [newLink, setNewLink] = useState({ title: "", url: "" });

  useEffect(() => {
    fetchLinkGroups();
  }, []);

  const fetchLinkGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<LinkGroup[]>(
        `${serverUrl}/api/linkGroups`
      );
      setLinkGroups(response.data);
    } catch (error) {
      console.error("Error fetching link groups:", error);
      setError("Failed to load link groups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered groups
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return linkGroups;

    const query = searchQuery.toLowerCase();
    return linkGroups.filter(
      (group) =>
        group.groupName.toLowerCase().includes(query) ||
        group.description?.toLowerCase().includes(query) ||
        group.links.some((link) => link.title.toLowerCase().includes(query))
    );
  }, [linkGroups, searchQuery]);

  const handleCreateGroup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (formData.links.length === 0) {
        alert("Please add at least one link to the group");
        return;
      }

      try {
        // Debug: Log the formData being sent
        console.log("Creating group with data:", formData);

        const response = await axios.post<LinkGroup>(
          `${serverUrl}/api/linkGroup`,
          formData
        );
        setLinkGroups((prev) => [response.data, ...prev]);
        setShowCreateModal(false);
        resetForm();
      } catch (error) {
        console.error("Error creating link group:", error);
        alert("Failed to create link group. Please try again.");
      }
    },
    [formData]
  );

  const handleUpdateGroup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingGroup) return;

      if (formData.links.length === 0) {
        alert("Please add at least one link to the group");
        return;
      }

      try {
        const response = await axios.put<LinkGroup>(
          `${serverUrl}/api/linkGroup/${editingGroup._id}`,
          formData
        );
        setLinkGroups((prev) =>
          prev.map((group) =>
            group._id === editingGroup._id ? response.data : group
          )
        );
        setEditingGroup(null);
        resetForm();
      } catch (error) {
        console.error("Error updating link group:", error);
        alert("Failed to update link group. Please try again.");
      }
    },
    [editingGroup, formData]
  );

  const handleDeleteGroup = useCallback(async (groupId: string) => {
    if (!window.confirm("Are you sure you want to delete this link group?")) {
      return;
    }

    try {
      await axios.delete(`${serverUrl}/api/linkGroup/${groupId}`);
      setLinkGroups((prev) => prev.filter((group) => group._id !== groupId));
    } catch (error) {
      console.error("Error deleting link group:", error);
      alert("Failed to delete link group. Please try again.");
    }
  }, []);

  const addLinkToForm = useCallback(() => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      alert("Please fill in both title and URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(newLink.url);
    } catch {
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { ...newLink, order: prev.links.length }],
    }));
    setNewLink({ title: "", url: "" });
  }, [newLink]);

  const removeLinkFromForm = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links
        .filter((_, i) => i !== index)
        .map((link, i) => ({ ...link, order: i })),
    }));
  }, []);

  const reorderLinks = useCallback((fromIndex: number, toIndex: number) => {
    setFormData((prev) => {
      const newLinks = [...prev.links];
      const [movedLink] = newLinks.splice(fromIndex, 1);
      newLinks.splice(toIndex, 0, movedLink);
      return {
        ...prev,
        links: newLinks.map((link, i) => ({ ...link, order: i })),
      };
    });
  }, []);

  const openEditModal = useCallback((group: LinkGroup) => {
    setEditingGroup(group);
    setFormData({
      groupName: group.groupName,
      description: group.description,
      profileImage: group.profileImage || "",
      links: group.links,
    });
  }, []);

  const copyGroupUrl = useCallback((groupUrl: string) => {
    const fullUrl = `${window.location.origin}/g/${groupUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(groupUrl);
    setTimeout(() => setCopiedUrl(null), 2000);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      groupName: "",
      description: "",
      profileImage: "",
      links: [],
    });
    setNewLink({ title: "", url: "" });
  }, []);

  const closeModal = useCallback(() => {
    setShowCreateModal(false);
    setEditingGroup(null);
    resetForm();
  }, [resetForm]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Link Groups</h1>
            <p className="text-blue-200">
              Create and manage your link collections
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Create Group
          </button>
        </div>

        {/* Search and View Toggle */}
        {!loading && linkGroups.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
                size={20}
              />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-blue-300 hover:bg-white/10"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-blue-300 hover:bg-white/10"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-200">{error}</p>
            <button
              onClick={fetchLinkGroups}
              className="mt-2 text-sm text-red-100 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <CircularProgress />
          </div>
        )}

        {/* Empty State */}
        {!loading && linkGroups.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link2 size={40} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No link groups yet
            </h3>
            <p className="text-blue-200 mb-6">
              Create your first link group to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Your First Group
            </button>
          </div>
        )}

        {/* Groups Grid/List */}
        {!loading && filteredGroups.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredGroups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                viewMode={viewMode}
                copiedUrl={copiedUrl}
                onEdit={openEditModal}
                onCopy={copyGroupUrl}
                onDelete={handleDeleteGroup}
              />
            ))}
          </div>
        )}

        {/* No Search Results */}
        {!loading && linkGroups.length > 0 && filteredGroups.length === 0 && (
          <div className="text-center py-20">
            <p className="text-blue-200 mb-4">No groups match your search</p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-400 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {(showCreateModal || editingGroup) && (
          <GroupModal
            isEdit={!!editingGroup}
            formData={formData}
            setFormData={setFormData}
            newLink={newLink}
            setNewLink={setNewLink}
            onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}
            onClose={closeModal}
            addLinkToForm={addLinkToForm}
            removeLinkFromForm={removeLinkFromForm}
            reorderLinks={reorderLinks}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Separate GroupCard component for better organization
interface GroupCardProps {
  group: LinkGroup;
  viewMode: "grid" | "list";
  copiedUrl: string | null;
  onEdit: (group: LinkGroup) => void;
  onCopy: (groupUrl: string) => void;
  onDelete: (groupId: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  viewMode,
  copiedUrl,
  onEdit,
  onCopy,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-2xl transition-all ${
        viewMode === "list" ? "flex items-center gap-6" : ""
      }`}
    >
      <div
        className={`flex items-start ${
          viewMode === "list" ? "flex-row flex-1 gap-4" : "flex-col"
        }`}
      >
        <div
          className={`flex items-start ${
            viewMode === "grid" ? "justify-between mb-4 w-full" : "gap-4"
          }`}
        >
          {group.profileImage ? (
            <img
              src={group.profileImage}
              alt={group.groupName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl border-2 border-white/30 flex-shrink-0">
              {group.groupName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className={`flex-1 ${viewMode === "grid" ? "ml-4" : ""}`}>
            <h3 className="text-xl font-bold text-white mb-1">
              {group.groupName}
            </h3>
            <p className="text-sm text-blue-200 line-clamp-2">
              {group.description || "No description"}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-4 text-sm text-blue-200 ${
            viewMode === "grid" ? "mb-4" : ""
          }`}
        >
          <span className="flex items-center gap-1">
            <Link2 size={14} />
            {group.links.length} link{group.links.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div
          className={`bg-white/10 rounded-lg p-3 ${
            viewMode === "grid" ? "mb-4" : "flex-1"
          }`}
        >
          <p className="text-xs text-blue-200 mb-1">Group URL:</p>
          <div className="flex items-center gap-2">
            <code className="text-sm text-white flex-1 truncate">
              /g/{group.groupUrl}
            </code>
            <button
              onClick={() => onCopy(group.groupUrl)}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Copy URL"
            >
              {copiedUrl === group.groupUrl ? (
                <Check size={16} className="text-green-400" />
              ) : (
                <Copy size={16} className="text-blue-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`flex gap-2 ${viewMode === "list" ? "flex-col" : ""}`}>
        <a
          href={`/g/${group.groupUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <ExternalLink size={16} />
          View
        </a>
        <button
          onClick={() => onEdit(group)}
          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          title="Edit group"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(group._id)}
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          title="Delete group"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// Group Modal Component (continued in next part)
interface GroupModalProps {
  isEdit: boolean;
  formData: {
    groupName: string;
    description: string;
    profileImage: string;
    links: Link[];
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      groupName: string;
      description: string;
      profileImage: string;
      links: Link[];
    }>
  >;
  newLink: { title: string; url: string };
  setNewLink: React.Dispatch<
    React.SetStateAction<{ title: string; url: string }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  addLinkToForm: () => void;
  removeLinkFromForm: (index: number) => void;
  reorderLinks: (fromIndex: number, toIndex: number) => void;
}

const GroupModal: React.FC<GroupModalProps> = ({
  isEdit,
  formData,
  setFormData,
  newLink,
  setNewLink,
  onSubmit,
  onClose,
  addLinkToForm,
  removeLinkFromForm,
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "scissor_uploads");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dmctp7kty/image/upload",
        formDataUpload
      );

      console.log("Image uploaded to Cloudinary:", response.data.secure_url);

      setFormData((prev) => {
        const updated = {
          ...prev,
          profileImage: response.data.secure_url,
        };
        console.log("Updated formData with image:", updated);
        return updated;
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">
            {isEdit ? "Edit Link Group" : "Create New Link Group"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              required
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={formData.groupName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, groupName: e.target.value }))
              }
              placeholder="My Social Links"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="A brief description of your link group"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Image size={16} />
                Profile Image
              </div>
            </label>

            <div className="space-y-3">
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    disabled={uploadingImage}
                  />
                  <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    {uploadingImage ? (
                      <>
                        <CircularProgress size={20} />
                        <span>Uploading...</span>
                      </>
                    ) : formData.profileImage ? (
                      <>
                        <Check size={20} className="text-green-600" />
                        <span className="text-green-600 dark:text-green-400">
                          Image uploaded
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        <span>Click to upload image</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {formData.profileImage && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={formData.profileImage}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, profileImage: "" }))
                  }
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Links {formData.links.length > 0 && `(${formData.links.length})`}
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  autoComplete="off"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Link title"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink((prev) => ({ ...prev, title: e.target.value }))
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLinkToForm();
                    }
                  }}
                />
                <input
                  type="url"
                  autoComplete="off"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://..."
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink((prev) => ({ ...prev, url: e.target.value }))
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLinkToForm();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addLinkToForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Add link"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {formData.links.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Link2 size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No links added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group"
                  >
                    <Link2 size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white truncate">
                        {link.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {link.url}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLinkFromForm(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                      title="Remove link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.links.length === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isEdit ? "Update" : "Create"} Group
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GroupLinks;
