import React from 'react';
import { FileText, Scale, Shield, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These terms govern your use of ZipTales and outline the rights and responsibilities 
            of all users in our community.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: January 15, 2025
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Quick Summary */}
          <div className="bg-gradient-to-r from-pink-500 to-blue-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white mb-2">Terms Summary</h2>
            <p className="text-pink-100 text-sm">
              Use ZipTales responsibly, respect our community, and help us fight misinformation together.
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Acceptance of Terms */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                By accessing or using ZipTales, you agree to be bound by these Terms of Service and our Privacy Policy. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Important:</strong> These terms constitute a legally binding agreement between you and ZipTales. 
                  Please read them carefully before using our platform.
                </p>
              </div>
            </section>

            {/* Description of Service */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Description of Service</h2>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                ZipTales is an AI-powered news verification platform that:
              </p>
              <ul className="text-gray-600 text-sm space-y-2 mb-4">
                <li>• Analyzes news articles for credibility using artificial intelligence</li>
                <li>• Enables community voting on article authenticity</li>
                <li>• Provides credibility scores based on multiple factors</li>
                <li>• Offers personalized news recommendations</li>
                <li>• Facilitates user-generated content submission and verification</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Disclaimer:</strong> ZipTales provides tools to help assess news credibility, but users should 
                  always exercise their own judgment and verify information from multiple sources.
                </p>
              </div>
            </section>

            {/* User Accounts */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">User Accounts</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Account Creation</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• You must be at least 13 years old to create an account</li>
                    <li>• Provide accurate and complete information</li>
                    <li>• Maintain the security of your account credentials</li>
                    <li>• One account per person is allowed</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• You are responsible for all activities under your account</li>
                    <li>• Notify us immediately of any unauthorized access</li>
                    <li>• Keep your contact information up to date</li>
                    <li>• Do not share your account with others</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Community Guidelines */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Community Guidelines</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Encouraged Behavior</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Submit accurate, well-sourced news</li>
                    <li>• Vote honestly on article credibility</li>
                    <li>• Engage in respectful discussions</li>
                    <li>• Report misinformation when found</li>
                    <li>• Help build a trustworthy community</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">❌ Prohibited Behavior</h3>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Spreading false or misleading information</li>
                    <li>• Manipulating votes or credibility scores</li>
                    <li>• Harassment or abusive behavior</li>
                    <li>• Creating multiple accounts</li>
                    <li>• Attempting to game the system</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Content Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Policy</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">User-Generated Content</h3>
                  <p className="text-blue-700 text-sm mb-2">
                    By submitting content to ZipTales, you grant us a non-exclusive, worldwide, royalty-free license to:
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Display and distribute your content on our platform</li>
                    <li>• Use your content for AI training and analysis</li>
                    <li>• Moderate and remove content that violates our guidelines</li>
                    <li>• Archive content for research and improvement purposes</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Content Standards</h3>
                  <p className="text-purple-700 text-sm">
                    All content must be legal, accurate, and respectful. We reserve the right to remove content 
                    that violates our standards or applicable laws.
                  </p>
                </div>
              </div>
            </section>

            {/* Reputation System */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reputation System</h2>
              
              <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">How Reputation Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Earn Points For:</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Submitting verified news (+30 points)</li>
                      <li>• Accurate voting (+20 points)</li>
                      <li>• Platform activity (+10 points)</li>
                      <li>• Community contributions (+15 points)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Lose Points For:</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Spreading misinformation (-40 points)</li>
                      <li>• Inaccurate voting (-10 points)</li>
                      <li>• Violating guidelines (-25 points)</li>
                      <li>• Spam or abuse (-30 points)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  ZipTales and its original content, features, and functionality are owned by Team Code Breakers 
                  and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Respect for Third-Party Rights</h3>
                  <p className="text-gray-600 text-sm">
                    Users must respect the intellectual property rights of others. Do not submit copyrighted 
                    content without proper authorization or attribution.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Disclaimers</h2>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">Service Availability</h3>
                <p className="text-orange-700 text-sm mb-4">
                  ZipTales is provided "as is" without warranties of any kind. We do not guarantee 
                  uninterrupted or error-free service.
                </p>
                
                <h3 className="font-semibold text-orange-800 mb-2">Content Accuracy</h3>
                <p className="text-orange-700 text-sm mb-4">
                  While we strive to provide accurate credibility assessments, users should always 
                  verify information independently and use their own judgment.
                </p>
                
                <h3 className="font-semibold text-orange-800 mb-2">Third-Party Content</h3>
                <p className="text-orange-700 text-sm">
                  We are not responsible for the accuracy, completeness, or reliability of 
                  third-party content or external links.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  To the maximum extent permitted by law, ZipTales and Team Code Breakers shall not be liable 
                  for any indirect, incidental, special, consequential, or punitive damages, including but not 
                  limited to loss of profits, data, or use, arising out of your use of the service.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">By You</h3>
                  <p className="text-gray-600 text-sm">
                    You may terminate your account at any time by contacting us or using account settings.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">By Us</h3>
                  <p className="text-gray-600 text-sm">
                    We may suspend or terminate accounts that violate these terms or engage in harmful behavior.
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 text-sm mb-4">
                We reserve the right to modify these terms at any time. We will notify users of material 
                changes via email or platform notifications. Continued use after changes constitutes acceptance.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-600 text-sm">
                These terms are governed by and construed in accordance with applicable international laws. 
                Any disputes will be resolved through binding arbitration or in courts of competent jurisdiction.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 text-sm mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <div><strong>Email:</strong> legal@ziptales.com</div>
                <div><strong>General Support:</strong> support@ziptales.com</div>
                <div><strong>Team Code Breakers:</strong> team@ziptales.com</div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  By using ZipTales, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;