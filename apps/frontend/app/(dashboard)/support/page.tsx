"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, HelpCircle, Phone } from "lucide-react";

const faqData = [
  {
    id: "1",
    question: "How do I create a new project?",
    answer:
      "To create a new project, go to your dashboard and click the 'Create Project' button. Fill in the project details, upload any necessary files, and publish your project to make it visible to the community.",
  },
  {
    id: "2",
    question: "How can I earn rewards on the platform?",
    answer:
      "You can earn rewards by creating quality content, participating in community activities, completing challenges, and receiving positive feedback from other users. Check the 'Monetize' section for more details.",
  },
  {
    id: "3",
    question: "What are Bravos and how do they work?",
    answer:
      "Bravos are recognition tokens that users can give to each other for outstanding work. You can earn Bravos by creating exceptional content and can use them to unlock special features and rewards.",
  },
  {
    id: "4",
    question: "How do I update my profile information?",
    answer:
      "Navigate to your profile page and click the 'Edit Profile' button. You can update your bio, profile picture, banner image, and other personal information from there.",
  },
  {
    id: "5",
    question: "How can I connect with other creators?",
    answer:
      "Use the 'Discover' section to find other creators and their projects. You can follow users, like their content, and leave comments to start building connections.",
  },
  {
    id: "6",
    question: "What should I do if I encounter a technical issue?",
    answer:
      "If you're experiencing technical problems, please contact our support team using the form below. Include details about the issue, your device/browser information, and any error messages you've received.",
  },
  {
    id: "7",
    question: "How do I delete my account?",
    answer:
      "To delete your account, please contact our support team. We'll guide you through the process and ensure all your data is properly removed from our systems.",
  },
  {
    id: "8",
    question: "Can I collaborate with other users on projects?",
    answer:
      "Yes! You can collaborate with other users by inviting them to work on your projects or by joining their projects. Use the project settings to manage collaborators and their permissions.",
  },
];

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Support request submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#171c21] mb-4">
          Support & FAQ
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions or get in touch with our support team
          for personalized help.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Mail className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-gray-600">support@consciousclub.com</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Available 9 AM - 6 PM EST</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Phone className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Find quick answers to the most common questions about using
            Conscious Club.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Can't find what you're looking for? Send us a message and we'll get
            back to you within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-2"
              >
                Subject *
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Brief description of your issue"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2"
              >
                Message *
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Please provide as much detail as possible about your question or issue..."
                rows={5}
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportPage;
