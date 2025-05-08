import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@src/components/ui/tabs";
import { sampleUsers } from "@src/scripts/seedData";
import { Copy } from "lucide-react";

export default function LoginHelper() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderCredentialCard = (title: string, email: string, password: string) => (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-md font-medium mb-2">{title}</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Email:</div>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{email}</code>
            <button 
              onClick={() => copyToClipboard(email, `${title}-email`)}
              className="text-gray-500 hover:text-gray-700"
              title="Copy email"
            >
              <Copy size={14} />
              {copied === `${title}-email` && (
                <span className="absolute text-xs bg-black text-white px-1 py-0.5 rounded -mt-8 ml-[-20px]">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Password:</div>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{password}</code>
            <button 
              onClick={() => copyToClipboard(password, `${title}-password`)}
              className="text-gray-500 hover:text-gray-700"
              title="Copy password"
            >
              <Copy size={14} />
              {copied === `${title}-password` && (
                <span className="absolute text-xs bg-black text-white px-1 py-0.5 rounded -mt-8 ml-[-20px]">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-4 text-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-gray-500">
            Need credentials to login? Click here
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">Sample Login Credentials</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs defaultValue="patients" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="doctors">Doctors</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="patients" className="space-y-4">
                {sampleUsers.patients.map((user, index) => (
                  <div key={index}>
                    {renderCredentialCard(`Patient ${index + 1}`, user.email, user.password)}
                  </div>
                ))}
                <div className="text-xs text-gray-500 text-center mt-2">
                  Click the copy icon to copy credentials to clipboard
                </div>
              </TabsContent>
              
              <TabsContent value="doctors" className="space-y-4">
                {sampleUsers.doctors.map((user, index) => (
                  <div key={index}>
                    {renderCredentialCard(`Doctor ${index + 1}`, user.email, user.password)}
                  </div>
                ))}
                <div className="text-xs text-gray-500 text-center mt-2">
                  Click the copy icon to copy credentials to clipboard
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="space-y-4">
                {renderCredentialCard("Admin", sampleUsers.admin.email, sampleUsers.admin.password)}
                <div className="text-xs text-gray-500 text-center mt-2">
                  Click the copy icon to copy credentials to clipboard
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-2 text-center">
            <Button 
              variant="default" 
              className="w-full"
              onClick={async () => {
                try {
                  const response = await fetch('/api/seed', {
                    method: 'POST',
                  });
                  
                  if (response.ok) {
                    alert('Database seeded successfully! You can now login with the sample credentials.');
                  } else {
                    alert('Failed to seed database. Please try again.');
                  }
                } catch (error) {
                  console.error('Error seeding database:', error);
                  alert('An error occurred while seeding the database.');
                }
              }}
            >
              Seed Database with Sample Data
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              This will create sample users and appointments for testing purposes
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
