'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  company: string;
  services: string[];
  pages: string;
  budget: string;
  timeline: string;
  links: string;
  additional: string;
  honeypot: string; // Spam protection
}

interface FormErrors {
  [key: string]: string;
}

const serviceOptions = [
  'website redesign',
  'custom website build',
  'advanced website build',
  'ongoing care',
  'add-ons',
];

const budgetOptions = ['under $1,500', '$1,500–$3,000', '$3,000–$6,000', '$6,000+'];

export default function StartProjectForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    services: [],
    pages: '',
    budget: '',
    timeline: '',
    links: '',
    additional: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitTime] = useState(Date.now());

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'please enter a valid email';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'please select at least one service';
    }

    if (!formData.budget) {
      newErrors.budget = 'please select your budget range';
    }

    return newErrors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));

    // Clear services error
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic spam protection - check form fill time
    const timeDiff = Date.now() - submitTime;
    if (timeDiff < 3000) {
      setSubmitStatus('error');
      return;
    }

    // Check honeypot
    if (formData.honeypot) {
      setSubmitStatus('error');
      return;
    }

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus first error field
      const firstErrorField = document.querySelector(
        `[name="${Object.keys(newErrors)[0]}"]`
      ) as HTMLElement;
      firstErrorField?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/start-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          services: [],
          pages: '',
          budget: '',
          timeline: '',
          links: '',
          additional: '',
          honeypot: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2 lowercase">thanks!</h3>
        <p className="text-green-700 lowercase">we&apos;ll email you a custom proposal shortly.</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-8 shadow-sm border border-ink/10"
    >
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={handleInputChange}
        style={{ position: 'absolute', left: '-9999px' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 lowercase">
            your name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="your name"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-describedby={errors.name ? 'name-error' : undefined}
            required
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600 lowercase" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 lowercase">
            email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-describedby={errors.email ? 'email-error' : undefined}
            required
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600 lowercase" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Company */}
      <div className="mt-6">
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2 lowercase">
          company or brand
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          placeholder="your company name (optional)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro"
        />
      </div>

      {/* Services */}
      <div className="mt-6">
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-3 lowercase">
            what do you need? *
          </legend>
          <div className="space-y-3">
            {serviceOptions.map((service) => (
              <label key={service} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  onChange={() => handleCheckboxChange(service)}
                  className="w-4 h-4 text-taro border-gray-300 rounded focus:ring-taro/20 focus:ring-2"
                />
                <span className="ml-3 text-gray-700 lowercase">{service}</span>
              </label>
            ))}
          </div>
          {errors.services && (
            <p className="mt-2 text-sm text-red-600 lowercase" role="alert">
              {errors.services}
            </p>
          )}
        </fieldset>
      </div>

      {/* Budget */}
      <div className="mt-6">
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2 lowercase">
          your budget range *
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro ${
            errors.budget ? 'border-red-300' : 'border-gray-300'
          }`}
          aria-describedby={errors.budget ? 'budget-error' : undefined}
          required
        >
          <option value="">select your budget range</option>
          {budgetOptions.map((option) => (
            <option key={option} value={option} className="lowercase">
              {option}
            </option>
          ))}
        </select>
        {errors.budget && (
          <p id="budget-error" className="mt-1 text-sm text-red-600 lowercase" role="alert">
            {errors.budget}
          </p>
        )}
      </div>

      {/* Pages/Features */}
      <div className="mt-6">
        <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-2 lowercase">
          pages or features you want
        </label>
        <textarea
          id="pages"
          name="pages"
          value={formData.pages}
          onChange={handleInputChange}
          placeholder="describe the pages or features you need (optional)"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro"
        />
      </div>

      {/* Timeline */}
      <div className="mt-6">
        <label
          htmlFor="timeline"
          className="block text-sm font-medium text-gray-700 mb-2 lowercase"
        >
          deadline or timeline
        </label>
        <input
          type="text"
          id="timeline"
          name="timeline"
          value={formData.timeline}
          onChange={handleInputChange}
          placeholder="when do you need this completed? (optional)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro"
        />
      </div>

      {/* Links */}
      <div className="mt-6">
        <label htmlFor="links" className="block text-sm font-medium text-gray-700 mb-2 lowercase">
          links to your current site or inspirations
        </label>
        <textarea
          id="links"
          name="links"
          value={formData.links}
          onChange={handleInputChange}
          placeholder="share urls of your current site or sites you like (optional)"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro"
        />
      </div>

      {/* Additional */}
      <div className="mt-6">
        <label
          htmlFor="additional"
          className="block text-sm font-medium text-gray-700 mb-2 lowercase"
        >
          anything else we should know?
        </label>
        <textarea
          id="additional"
          name="additional"
          value={formData.additional}
          onChange={handleInputChange}
          placeholder="any additional details about your project (optional)"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro"
        />
      </div>

      {/* Submit */}
      <div className="mt-8">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="w-full bg-taro text-white py-4 px-6 rounded-lg font-semibold hover:bg-taro/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed lowercase"
        >
          {isSubmitting ? 'sending...' : 'send project details'}
        </motion.button>
      </div>

      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-700 text-sm lowercase">
            something went wrong. please try again or email hello@pixelboba.com.
          </p>
        </motion.div>
      )}

      <p className="mt-4 text-sm text-gray-500 text-center lowercase">
        we&apos;ll respond within 24 hours with a custom proposal
      </p>
    </motion.form>
  );
}
