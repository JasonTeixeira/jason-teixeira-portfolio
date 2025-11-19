---
title: 'From Help Desk Hell to Cloud Architect: My Actual Journey'
description: 'I started answering printer tickets. Five years later, I'm deploying Kubernetes clusters handling millions in trades. Here's how I made the jump—and why you can too.'
date: '2024-11-18'
draft: false
slug: /pensieve/help-desk-to-cloud-architect
featuredImage: './cover.jpg'
category: 'Career'
tags:
  - Career
  - DevOps
  - Cloud Computing
  - Automation
  - Personal Growth
---

I used to reset passwords for a living.

"Have you tried turning it off and on again?" was my most-used sentence. I answered printer tickets, unlocked accounts, and explained to senior engineers why their email wasn't working (it was always DNS).

Five years later, I'm designing distributed systems that process $10M+ in daily trading volume, building ML pipelines on Kubernetes, and deploying infrastructure across three cloud providers.

This is the story of how I went from help desk hell to cloud architecture—the real story, not the LinkedIn version.

## The Breaking Point: Ticket #4,583

April 2019. 3:47 PM on a Friday.

I got a ticket: "Deployment failed. Need someone to manually restart the service. Again."

This was the third time that week. Same service. Same failure. Same manual fix.

I walked over to the engineer's desk. "What's causing this?"

He shrugged. "Legacy app. It just breaks sometimes. We restart it manually."

"Every week?"

"Sometimes twice a week."

Something clicked in my brain. Not in a good way.

I was spending 10-15 hours a week babysitting services that should have been automated. Restarting servers. Checking logs. Manually deploying code. All because "that's how we've always done it."

That's when I decided: **I'm not doing this anymore.**

## The First Script That Changed Everything

I didn't know much about programming. I'd taken one Python class in college and immediately forgot everything.

But I was angry enough to learn.

I spent that weekend learning Python. Not to "become a developer." Not to "change careers." Just to automate one stupid, repetitive task.

The script was 47 lines. It checked if the service was running, restarted it if needed, and sent a Slack notification. Took me 12 hours to write (Stack Overflow deserves co-author credit).

Monday morning, I deployed it to a cron job.

**I never touched that ticket queue again.**

The service still broke. But now a script fixed it in 30 seconds instead of me spending an hour.

My manager noticed. "Why are your incident response times so fast?"

"I automated it."

"Can you do that for other services?"

And just like that, my job changed.

## The Realization: Automation is a Career Cheat Code

Over the next six months, I automated everything I could:
- User provisioning (from 30 minutes to 2 minutes)
- Log aggregation (from manual grep to centralized ELK stack)
- Server health checks (from manual SSH to automated monitoring)
- Deployment processes (from 2-hour manual steps to 10-minute scripts)

I wasn't trying to eliminate my job. I was trying to eliminate the **boring parts** of my job.

But here's what happened: **I became indispensable.**

When something broke, people asked me to fix it—not because I was the fastest, but because I'd make sure it never broke that way again.

When we needed new infrastructure, they asked me to build it—not because I had the most experience, but because I'd automate the maintenance.

And when they needed someone to move into a cloud engineering role? They didn't hire externally. They asked me.

## The First Big Project: Migrating to AWS

2020. My manager pulled me aside.

"We're moving our infrastructure to AWS. You want to lead it?"

I had never used AWS. I'd barely heard of S3. Kubernetes was a word I'd seen on Hacker News but couldn't pronounce.

"Sure," I said, because apparently I hate myself.

The next three months were brutal. I was learning:
- AWS services (there are like 200 of them)
- Terraform (Infrastructure as Code is hard when you don't understand infrastructure)
- Docker (why are my containers 2GB?)
- CI/CD (Jenkins is a special kind of pain)
- Networking (VPCs, subnets, security groups, NAT gateways, oh my)

I was staying up until 2 AM most nights, reading documentation, watching YouTube tutorials, breaking things in dev environments, and then breaking them again.

But here's the thing: **I was learning by doing.** Not by taking courses. Not by getting certifications. By building actual infrastructure that actual people would use.

## The Moment It Clicked

Three months into the AWS migration, I had an epiphany.

I was debugging a deployment pipeline that kept failing. Spent four hours tracing through logs, checking IAM permissions, tweaking Terraform configs.

Finally figured it out: a missing environment variable in the ECS task definition.

But in those four hours, I'd learned:
- How ECS task definitions work
- IAM role assumption and trust policies
- CloudWatch log streaming
- How Terraform manages state
- Debugging distributed systems

**That's when I realized: I wasn't a help desk tech who learned to code. I was a cloud engineer.**

The problems I was solving weren't "have you tried restarting it?" anymore. They were "how do we design infrastructure that scales to 10,000 concurrent users?" and "how do we deploy 50 times a day without breaking production?"

## The Skills That Actually Mattered

Looking back, here are the skills that actually moved my career forward:

### 1. **Automation First, Always**
I never do anything manually more than twice. The third time, I automate it.

This mindset alone put me ahead of 80% of people.

### 2. **Understanding How Things Break**
I didn't just fix problems. I understood WHY they broke.

Why did the service crash? Why did the deployment fail? Why did the network timeout?

The "why" is what separates someone who follows runbooks from someone who designs systems.

### 3. **Learning to Be Comfortable with "I Don't Know (Yet)"**
I got asked to build things I had zero experience with. Kubernetes. Service mesh. Observability platforms.

The old me would have said "I don't know how to do that."

The new me says "I don't know how to do that yet. Give me a week."

### 4. **Writing Everything Down**
Every time I solved a problem, I documented it. Confluence pages. GitHub READMEs. Runbooks.

Not for other people. For future me.

Turns out, future me is an idiot who forgets everything. Documentation helps.

### 5. **Building Things That Make Other People's Jobs Easier**
I didn't just automate MY work. I built tools that helped developers, QA engineers, and other teams.

A CLI tool for deploying to staging. A dashboard for monitoring production. A script for generating test data.

People remember the person who made their life easier.

## The Big Jump: Quantitative Finance

2022. I got a message on LinkedIn.

"We're looking for someone to build trading infrastructure. Kubernetes, AWS, low-latency systems. Interested?"

I had zero finance experience. I didn't know what a Sharpe ratio was. I thought "alpha generation" was a Star Trek reference.

But they weren't hiring for finance knowledge. They were hiring for:
- **Cloud infrastructure expertise** (AWS, GCP, K8s)
- **Automation and DevOps** (CI/CD, IaC, monitoring)
- **Systems thinking** (How to design resilient, scalable systems)
- **Problem-solving** (Figuring out things you don't know)

All the skills I'd built in the last three years.

I took the job. And holy shit, it was hard.

But it was hard in the same way the AWS migration was hard: I was learning by building. Real-time data pipelines. WebSocket streaming. Low-latency order execution. Distributed backtesting systems.

Every day was "I have no idea how to do this. Let me figure it out."

And every day, I did.

## What I'd Tell My 2019 Self

If I could go back to that help desk in 2019, here's what I'd say:

### **1. Start Automating, Even Badly**
Your first scripts will be terrible. Mine were. Automating one thing badly is better than doing it manually perfectly.

### **2. Learn by Building, Not by Courses**
I never took a DevOps bootcamp. I never got AWS certifications (until later, for resume checkboxes). I learned by breaking things and fixing them.

Courses are fine. But building is better.

### **3. Document Everything**
Future you is an idiot. Help them out.

### **4. Don't Wait for Permission**
I didn't wait for someone to tell me "you're ready to be a cloud engineer." I just started solving cloud engineering problems.

Your title changes when your work changes.

### **5. Find the Boring, Repetitive Work and Kill It**
That's where automation lives. That's where your career growth is.

### **6. Be the Person Who Makes Things Better**
Don't just complain about bad systems. Fix them. Build better ones.

People notice the person who improves things.

### **7. You Don't Need to Be the Smartest. You Need to Be the Most Persistent.**
I wasn't the best engineer. I wasn't the fastest learner. I just refused to give up on problems.

That's more valuable than you think.

## Where I Am Now

Today, I'm building:
- Trading systems processing millions of dollars daily
- Kubernetes infrastructure auto-scaling across 3 cloud providers
- ML pipelines training models on terabytes of market data
- Monitoring systems that catch issues before they become outages

I work with incredibly smart people who went to MIT, Stanford, and CMU. They have PhDs in Computer Science and years more experience than me.

But I'm here because I learned to solve hard problems by diving in and figuring them out.

## The Bottom Line

**You don't need a CS degree.**  
**You don't need to be a "genius coder."**  
**You don't need 10 years of experience.**

You need:
- The willingness to automate boring work
- The ability to learn by doing
- The persistence to solve hard problems
- The humility to say "I don't know, but I'll figure it out"

Five years ago, I was resetting passwords.

Today, I'm deploying distributed systems.

The difference? I wrote a 47-line Python script and didn't stop.

If I can do it, you can too.

---

## What's Next for You?

If you're in a similar position—stuck in a role that feels too small, too repetitive, too boring—here's my advice:

**This week:**
- Find one repetitive task you do
- Write a script to automate it (even badly)
- Deploy it

**This month:**
- Automate 3-5 more tasks
- Document what you learned
- Build something that helps your team

**This year:**
- Learn a cloud platform (AWS, GCP, Azure—doesn't matter which)
- Build a real project and deploy it
- Start saying yes to projects you don't know how to do yet

You don't need to quit your job. You don't need to go back to school. You just need to start building.

The rest will follow.

---

## Related Posts

More on career growth and learning:
- [How I Built a 590K LOC App (Without Going Insane)](/pensieve/nexquantsite-590k-loc)
- [Building AlphaStream: ML Trading That Actually Works](/pensieve/alphastream-ml-trading)
- [My Development Philosophy: Build, Break, Learn](/pensieve/development-philosophy) (coming soon)

Questions? Want to share your own journey? [Reach out](/contact) or [find me on GitHub](https://github.com/JasonTeixeira).

**You got this.** 🚀
