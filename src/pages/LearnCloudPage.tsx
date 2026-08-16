import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, PageHeader, Badge } from '@/components/ui';
import { Cloud, Server, Boxes, AppWindow, TrendingUp, Scale, Lock, ShieldCheck, DollarSign, Layers, Network, HardDrive, GitBranch, Repeat, ArrowLeftRight } from 'lucide-react';

interface Concept {
  title: string;
  icon: React.ReactNode;
  definition: string;
  example: string;
  analogy: string;
  projectRelevance: string;
  advantages?: string[];
  disadvantages?: string[];
}

const CONCEPTS: Concept[] = [
  {
    title: 'Cloud Computing',
    icon: <Cloud className="w-5 h-5" />,
    definition: 'Delivering computing services — servers, storage, databases, networking, software — over the internet ("the cloud") on a pay-as-you-go basis.',
    example: 'AWS, Microsoft Azure, Google Cloud Platform provide cloud services. You rent what you need instead of buying physical servers.',
    analogy: 'Like renting electricity from the grid instead of building your own power plant. You pay for what you use.',
    projectRelevance: 'The entire application helps users decide which type of cloud service (IaaS, PaaS, SaaS) best fits their needs.',
    advantages: ['Pay-as-you-go pricing', 'No upfront hardware cost', 'Access from anywhere', 'Rapid provisioning'],
    disadvantages: ['Ongoing costs', 'Depends on internet', 'Less control over infrastructure', 'Potential vendor lock-in'],
  },
  {
    title: 'Cloud Provider',
    icon: <Server className="w-5 h-5" />,
    definition: 'A company that offers cloud computing services. They own and operate the data centers, hardware, and infrastructure.',
    example: 'Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP) are the three largest cloud providers.',
    analogy: 'Like a landlord who owns apartment buildings and rents units to tenants.',
    projectRelevance: 'The cost engine estimates costs based on typical provider pricing models, though it uses illustrative numbers, not real provider prices.',
  },
  {
    title: 'Server',
    icon: <Server className="w-5 h-5" />,
    definition: 'A computer designed to run continuously and provide services to other computers over a network.',
    example: 'A web server hosts your website and sends pages to visitors\' browsers. A database server stores and retrieves data.',
    analogy: 'Like a restaurant kitchen — it does the work and serves results to customers (clients).',
    projectRelevance: 'IaaS lets you rent virtual servers. The decision engine evaluates whether the user needs to manage servers themselves (IaaS) or have the provider manage them (PaaS/SaaS).',
  },
  {
    title: 'Virtual Machine (VM)',
    icon: <Layers className="w-5 h-5" />,
    definition: 'A software-based computer that runs inside a physical computer. It has its own OS and behaves like a real machine.',
    example: 'AWS EC2 instances are virtual machines. You can run multiple VMs on one physical server.',
    analogy: 'Like having multiple apartments in one building — each is independent but shares the same physical structure.',
    projectRelevance: 'VMs are the core unit of IaaS. The cost engine estimates VM costs based on traffic level and user count.',
  },
  {
    title: 'Virtualization',
    icon: <Layers className="w-5 h-5" />,
    definition: 'The technology that creates virtual versions of computing resources — servers, storage, networks — from physical hardware.',
    example: 'VMware, KVM, and Hyper-V are virtualization platforms. AWS uses virtualization to create EC2 instances from physical servers.',
    analogy: 'Like dividing a large room with movable walls into smaller rooms. You can change the layout without building new walls.',
    projectRelevance: 'Virtualization is the foundation of IaaS. The provider manages virtualization; the user manages everything above it.',
  },
  {
    title: 'IaaS — Infrastructure as a Service',
    icon: <Server className="w-5 h-5" />,
    definition: 'Renting computing infrastructure — VMs, storage, networking — from a cloud provider. You manage OS, runtime, and applications.',
    example: 'AWS EC2 (virtual machines), Azure Virtual Machines, Google Compute Engine. You install the OS, configure everything, and deploy your app.',
    analogy: 'Renting an empty plot of land. You build the house, install plumbing, bring furniture. The landlord only owns the land.',
    projectRelevance: 'The decision engine scores IaaS based on infrastructure control, customization, technical expertise, and management preference. High infrastructure control → high IaaS score.',
    advantages: ['Maximum control', 'Highly customizable', 'Low vendor lock-in', 'Direct security control'],
    disadvantages: ['Requires technical expertise', 'High management overhead', 'Slower deployment', 'Responsible for OS patching'],
  },
  {
    title: 'PaaS — Platform as a Service',
    icon: <Boxes className="w-5 h-5" />,
    definition: 'Renting a managed platform to build, deploy, and run applications. You bring code and data; the provider manages runtime, OS, and infrastructure.',
    example: 'Heroku, AWS Elastic Beanstalk, Google App Engine, Azure App Service. You deploy code; the provider handles servers.',
    analogy: 'Renting a fully equipped kitchen. You bring ingredients and cook. The landlord maintains the kitchen, gas, and appliances.',
    projectRelevance: 'The decision engine scores PaaS based on customization needs, deployment speed, and low infrastructure management preference. High customization + low management → high PaaS score.',
    advantages: ['Faster deployment', 'Less management', 'Built-in scalability', 'Focus on application code'],
    disadvantages: ['Less infrastructure control', 'Potential vendor lock-in', 'Platform-specific limitations', 'May cost more for steady workloads'],
  },
  {
    title: 'SaaS — Software as a Service',
    icon: <AppWindow className="w-5 h-5" />,
    definition: 'Using ready-made software delivered over the internet. The provider manages the entire stack — application, data, runtime, OS, infrastructure.',
    example: 'Google Workspace, Microsoft 365, Salesforce, Slack, Zoom. You just log in and use the software.',
    analogy: 'Eating at a restaurant. You order and eat. The restaurant handles cooking, ingredients, staff, and the building.',
    projectRelevance: 'The decision engine scores SaaS based on low customization, fast deployment, low management preference, and ready-made software needs. Low customization + fast deployment → high SaaS score.',
    advantages: ['Fastest deployment', 'No management', 'Predictable pricing', 'No technical expertise needed'],
    disadvantages: ['Least customization', 'High vendor lock-in', 'Limited data control', 'Recurring subscription costs'],
  },
  {
    title: 'Scalability',
    icon: <TrendingUp className="w-5 h-5" />,
    definition: 'The ability of a system to handle increasing load by adding resources. Scale up (vertical) means bigger machines; scale out (horizontal) means more machines.',
    example: 'An e-commerce site adds more servers during Black Friday to handle traffic spikes. AWS Auto Scaling does this automatically.',
    analogy: 'A restaurant adding more tables (scale out) or bigger tables (scale up) to serve more customers.',
    projectRelevance: 'The decision engine considers scalability as a technical factor. PaaS often has built-in auto-scaling; IaaS requires manual configuration.',
  },
  {
    title: 'Elasticity',
    icon: <ArrowLeftRight className="w-5 h-5" />,
    definition: 'The ability to automatically add or remove resources based on current demand. Resources expand when demand rises and shrink when it falls.',
    example: 'AWS Auto Scaling Groups add VMs when traffic spikes and remove them when traffic drops. You only pay for what you use.',
    analogy: 'An accordion — it expands when you need more capacity and contracts when you need less.',
    projectRelevance: 'Elasticity is a key advantage of cloud over on-premises. The cost engine factors in usage patterns (steady, variable, seasonal, spiky) to estimate costs.',
  },
  {
    title: 'Cloud Storage',
    icon: <HardDrive className="w-5 h-5" />,
    definition: 'Storing data on remote servers managed by a cloud provider, accessible over the internet.',
    example: 'Amazon S3 (object storage), Azure Blob Storage, Google Cloud Storage. You store files without managing physical disks.',
    analogy: 'Like a rented storage unit — you put your stuff there and access it anytime without maintaining the facility.',
    projectRelevance: 'The cost engine estimates storage costs for each model based on user count and application type.',
  },
  {
    title: 'Cloud Networking',
    icon: <Network className="w-5 h-5" />,
    definition: 'Network services provided by cloud providers — virtual networks, load balancers, firewalls, DNS, content delivery networks.',
    example: 'AWS VPC (Virtual Private Cloud), Azure VNet, Google VPC let you create isolated networks in the cloud.',
    analogy: 'Like the roads and traffic lights in a city — they connect everything and control flow.',
    projectRelevance: 'Custom networking is a key IaaS differentiator. The decision engine scores IaaS higher when infrastructure control and custom networking are required.',
  },
  {
    title: 'TCO — Total Cost of Ownership',
    icon: <DollarSign className="w-5 h-5" />,
    definition: 'The complete cost of owning and operating a system over its lifetime, including upfront costs, ongoing costs, maintenance, staff, and training.',
    example: 'A server\'s TCO includes the hardware cost, electricity, cooling, network, staff time, and maintenance over 3-5 years.',
    analogy: 'Owning a car isn\'t just the purchase price — it\'s fuel, insurance, maintenance, parking, and repairs over the years.',
    projectRelevance: 'The cost engine calculates 3-year TCO for each model: Initial Cost + (Monthly Cost × 36). This helps users see long-term costs, not just monthly.',
  },
  {
    title: 'Vendor Lock-in',
    icon: <Lock className="w-5 h-5" />,
    definition: 'When switching from one provider to another is difficult or expensive due to proprietary technology, data formats, or contracts.',
    example: 'If your app uses AWS Lambda (serverless functions), moving to Azure requires rewriting code. That\'s vendor lock-in.',
    analogy: 'Like a phone that only works with one carrier. Switching carriers means buying a new phone.',
    projectRelevance: 'The decision engine includes vendor lock-in tolerance as a business factor. Low tolerance → IaaS scores higher (more portable). High tolerance → SaaS is acceptable.',
  },
  {
    title: 'Shared Responsibility',
    icon: <ShieldCheck className="w-5 h-5" />,
    definition: 'In cloud computing, security and management are shared between the provider and the customer. The boundary depends on the service model.',
    example: 'In IaaS, you secure the OS and application. In SaaS, the provider secures almost everything. You always secure your data and access.',
    analogy: 'Like renting an apartment: the landlord maintains the building, but you lock your door and keep your valuables safe.',
    projectRelevance: 'The application displays a responsibility matrix showing who manages each layer for IaaS, PaaS, and SaaS. This helps users understand what they\'re responsible for.',
  },
  {
    title: 'Public, Private & Hybrid Cloud',
    icon: <GitBranch className="w-5 h-5" />,
    definition: 'Public cloud: shared infrastructure owned by a provider. Private cloud: dedicated infrastructure for one organization. Hybrid: a mix of both.',
    example: 'AWS is public cloud. A company\'s on-premises OpenStack deployment is private cloud. Using AWS for web servers and on-prem for the database is hybrid.',
    analogy: 'Public cloud = public transport (shared). Private cloud = your own car. Hybrid = using both depending on the trip.',
    projectRelevance: 'The decision engine focuses on service models (IaaS/PaaS/SaaS) rather than deployment models, but understanding deployment options is important context.',
  },
];

export function LearnCloudPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Learn Cloud Computing" subtitle="Understand the cloud concepts behind this project" />
      <div className="space-y-4">
        {CONCEPTS.map((c, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">{c.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-3">{i + 1}. {c.title}</h3>
                <div className="space-y-3 text-sm">
                  <div><span className="font-medium text-gray-700">Definition: </span><span className="text-gray-600">{c.definition}</span></div>
                  <div><span className="font-medium text-gray-700">Example: </span><span className="text-gray-600">{c.example}</span></div>
                  <div><span className="font-medium text-gray-700">Analogy: </span><span className="text-gray-600">{c.analogy}</span></div>
                  <div><span className="font-medium text-gray-700">Project Relevance: </span><span className="text-gray-600">{c.projectRelevance}</span></div>
                  {c.advantages && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <div className="flex-1"><p className="font-medium text-emerald-600 mb-1">Advantages</p><ul className="space-y-0.5">{c.advantages.map((a, j) => <li key={j} className="text-xs text-gray-600">+ {a}</li>)}</ul></div>
                      <div className="flex-1"><p className="font-medium text-amber-600 mb-1">Disadvantages</p><ul className="space-y-0.5">{c.disadvantages?.map((d, j) => <li key={j} className="text-xs text-gray-600">- {d}</li>)}</ul></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
