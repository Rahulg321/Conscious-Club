import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Mail,
  MessageCircle,
  BookOpen,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const SupportPage = () => {
  const faqData = [
    {
      id: 1,
      question: "How do I create a new project?",
      answer:
        "To create a new project, click the 'Upload Project' button in the discover page or use the upload dialog. Fill in your project details, add tags, and upload your project files. Make sure to include a compelling description and cover image.",
    },
    {
      id: 2,
      question: "How can I edit my profile?",
      answer:
        "Navigate to your profile page and click the edit button. You can update your personal information, bio, skills, location, and profile picture. Changes are saved automatically.",
    },
    {
      id: 3,
      question: "What file formats are supported for project uploads?",
      answer:
        "We support most common file formats including images (JPG, PNG, GIF), documents (PDF, DOC, DOCX), videos (MP4, MOV, AVI), and design files (PSD, AI, SKETCH). Maximum file size is 100MB per file.",
    },
    {
      id: 4,
      question: "How do I discover new projects?",
      answer:
        "Use the Discover page to browse projects by category, tags, or search terms. You can filter by discipline, location, or project type. The algorithm shows you projects based on your interests and activity.",
    },
    {
      id: 5,
      question: "Can I collaborate with other users?",
      answer:
        "Yes! You can follow other users, like their projects, and leave comments. For direct collaboration, you can contact users through their profile pages or use the messaging system.",
    },
    {
      id: 6,
      question: "How do I reset my password?",
      answer:
        "On the login page, click 'Forgot Password' and enter your email address. You'll receive a password reset link via email. Follow the instructions in the email to create a new password.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Support & FAQ</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get help with ConsciousClub. Find answers to common questions or
            contact our support team.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-lg">24/7 Support</h3>
              <p className="text-gray-600 text-sm">
                We're here to help around the clock
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-lg">Quick Response</h3>
              <p className="text-gray-600 text-sm">
                Average response time under 2 hours
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-lg">Multiple Channels</h3>
              <p className="text-gray-600 text-sm">
                Email, chat, and phone support
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqData.map((faq) => (
                <Card
                  key={faq.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium text-left">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
