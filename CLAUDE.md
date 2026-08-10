# DTALES Frontend Development Guide

## Project Overview

This project is the official frontend for DTALES Tech.

It is a React + Vite + TypeScript application connected to an Express backend and Supabase database.

The project is currently undergoing a complete redesign of the Portfolio, Blogs, Case Studies, and Admin pages.

The redesign focuses on improving UI/UX while keeping the backend architecture stable.

---

## Tech Stack

React

Vite

TypeScript

Tailwind CSS

Framer Motion

HashRouter

shadcn/ui

Express

Supabase

---

## Architecture Rules

Never modify backend APIs unless explicitly instructed.

Never change database schema.

Never change Supabase storage structure.

Never introduce unnecessary dependencies.

Prefer reusable components.

Prefer composition over duplication.

Keep TypeScript strict.

Use Tailwind CSS.

Use Framer Motion for animations.

Maintain clean folder structure.

Keep code modular.

---

## UI Guidelines

The UI should be premium.

Minimal.

Apple-inspired.

Modern.

Elegant.

Technology-focused.

Professional.

Spacing should be generous.

Animations should be subtle.

Typography should be clean.

Dark theme remains the default unless a page explicitly uses a light design.

---

## Portfolio Redesign Rules

We are rebuilding the Portfolio frontend.

The backend remains unchanged.

Do not attempt to fix legacy Portfolio code unless instructed.

Build new reusable components.

Do not hardcode data that already exists in the backend.

Case Studies should be fetched dynamically.

Statistics remain hardcoded.

Capability pages should use one reusable template.

---

## Code Quality

Avoid duplicated code.

Avoid large components.

Split components logically.

Prefer reusable hooks.

Use meaningful names.

Use clean imports.

Use TypeScript best practices.

Write production-quality code.

---

## Workflow

Never redesign multiple sections at once.

Implement one feature.

Wait for review.

Proceed to the next feature.

Never perform destructive changes without confirmation.

Prioritize maintainability, readability, scalability, and production-quality code.
