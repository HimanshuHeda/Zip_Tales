import React from 'react';
import { Shield, Eye, Lock, Users, Database, Globe } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how ZipTales collects, 
            uses, and protects your personal information.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: January 15, 2025
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Quick Overview */}
          <div className="bg-gradient-to-r from-pink-500 to-blue-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white mb-2">Privacy at a Glance</h2>
            <p className="text-pink-100 text-sm">
              We collect minimal data, use it responsibly, and give you control over your information.
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Information We Collect */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Email address and name (required for account creation)</li>
                    <li>• Profile information you choose to provide (bio, location, interests)</li>
                    <li>• Profile picture (optional)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Articles you view, vote on, and save</li>
                    <li>• News submissions and comments</li>
                    <li>• Voting patterns and reputation scores</li>
                    <li>• Platform interaction data (clicks, time spent)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Information</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• IP address and device information</li>
                    <li>• Browser type and version</li>
                    <li>• Cookies and similar tracking technologies</li>
                    <li>• Log files and error reports</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Core Platform Functions</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Provide news verification services</li>
                    <li>• Calculate credibility scores</li>
                    <li>• Enable community voting</li>
                    <li>• Personalize news recommendations</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Account Management</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Authenticate and secure your account</li>
                    <li>• Provide customer support</li>
                    <li>• Send important updates</li>
                    <li>• Maintain reputation systems</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Platform Improvement</h3>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li>• Analyze usage patterns</li>
                    <li>• Improve AI algorithms</li>
                    <li>• Fix bugs and issues</li>
                    <li>• Develop new features</li>
                  </ul>
                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h3 className="font-semibold text-pink-800 mb-2">Safety & Security</h3>
                  <ul className="text-pink-700 text-sm space-y-1">
                    <li>• Detect and prevent fraud</li>
                    <li>• Combat misinformation</li>
                    <li>• Enforce community guidelines</li>
                    <li>• Protect user safety</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">We DO NOT sell your personal data</h3>
                <p className="text-red-700 text-sm">
                  ZipTales will never sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">We may share information in these limited cases:</h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• <strong>With your consent:</strong> When you explicitly agree to share information</li>
                    <li>• <strong>Service providers:</strong> Trusted partners who help operate our platform (hosting, analytics)</li>
                    <li>• <strong>Legal requirements:</strong> When required by law or to protect rights and safety</li>
                    <li>• <strong>Business transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                    <li>• <strong>Public information:</strong> Content you choose to make public (articles, votes, comments)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="h-6 w-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Technical Safeguards</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• SSL/TLS encryption for data transmission</li>
                    <li>• Encrypted data storage</li>
                    <li>• Regular security audits</li>
                    <li>• Access controls and authentication</li>
                    <li>• Secure backup systems</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Operational Safeguards</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Limited employee access to data</li>
                    <li>• Regular staff security training</li>
                    <li>• Incident response procedures</li>
                    <li>• Third-party security assessments</li>
                    <li>• Compliance monitoring</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="h-6 w-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Your Privacy Rights</h2>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-4">You have the right to:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-blue-700 text-sm space-y-2">
                    <li>• <strong>Access:</strong> Request a copy of your personal data</li>
                    <li>• <strong>Correct:</strong> Update inaccurate information</li>
                    <li>• <strong>Delete:</strong> Request deletion of your account and data</li>
                    <li>• <strong>Port:</strong> Export your data in a readable format</li>
                  </ul>
                  <ul className="text-blue-700 text-sm space-y-2">
                    <li>• <strong>Restrict:</strong> Limit how we process your data</li>
                    <li>• <strong>Object:</strong> Opt out of certain data processing</li>
                    <li>• <strong>Withdraw consent:</strong> Revoke previously given permissions</li>
                    <li>• <strong>Complain:</strong> File complaints with data protection authorities</li>
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-blue-700 text-sm">
                    To exercise these rights, contact us at <strong>privacy@ziptales.com</strong> or through your account settings.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-600 text-sm">
                    Required for basic platform functionality, authentication, and security. These cannot be disabled.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                  <p className="text-gray-600 text-sm">
                    Help us understand how users interact with our platform to improve performance and user experience.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Preference Cookies</h3>
                  <p className="text-gray-600 text-sm">
                    Remember your settings and preferences to provide a personalized experience.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="text-yellow-800 text-sm space-y-2">
                  <li>• <strong>Account data:</strong> Retained while your account is active</li>
                  <li>• <strong>Usage data:</strong> Aggregated data may be retained for analytics</li>
                  <li>• <strong>Deleted accounts:</strong> Personal data removed within 30 days</li>
                  <li>• <strong>Legal requirements:</strong> Some data may be retained longer if required by law</li>
                </ul>
              </div>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
              <p className="text-gray-600 text-sm mb-4">
                ZipTales operates globally with team members and servers in different countries. 
                We ensure appropriate safeguards are in place when transferring data internationally, 
                including standard contractual clauses and adequacy decisions.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  ZipTales is not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If we become aware that we have 
                  collected such information, we will take steps to delete it promptly.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 text-sm mb-4">
                We may update this privacy policy from time to time. We will notify you of any 
                material changes by posting the new policy on this page and updating the "Last updated" 
                date. We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 text-sm mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <div><strong>Email:</strong> privacy@ziptales.com</div>
                <div><strong>General Contact:</strong> support@ziptales.com</div>
                <div><strong>Data Protection Officer:</strong> dpo@ziptales.com</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;