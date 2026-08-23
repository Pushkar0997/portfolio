---
title: Quantum Arcade
tagline: Learn quantum computing the way you'd learn a language — short interactive levels, immediate feedback, and real physics underneath.
status: live
year: '2026'
access: 'Start at Level 1 in the browser. No account needed.'
links:
  site: https://quantum-arcade.web.app/
featured: true
order: 1
---

## What it is

A structured path through quantum computing, built as levels rather than lessons.

Each one gives you a target — get this qubit to a 50/50 superposition, flip that one, entangle these two — and a circuit board to reach it on. You place a gate, the state updates immediately, and you can see whether you got closer or further. When the state matches, the level clears and the next one adds one new idea.

Level 1 assumes you know nothing. Not "nothing about quantum computing" in the way textbooks mean it, where you still need linear algebra — nothing.

## Why it's built this way

The usual path into quantum computing asks you to install Python, learn a framework's API, and read bra-ket notation before you can watch a single qubit do anything. That ordering loses people who would have understood the concept perfectly well if they had seen it happen first.

Superposition is a strange claim in a textbook and an obvious one on screen. Place an H gate on `|0⟩` and watch a definite state become a 50/50 split. Place a second one and watch it collapse back, because `H · H = I`. The maths is the same either way; the order you meet it in decides whether it lands.

Short levels, one new idea at a time, immediate feedback on every action. The format is borrowed from language learning because it works for the same reason: the feedback loop is tight enough that you correct yourself before you form a wrong intuition.

## The composer

Alongside the levels there's a free-form circuit builder with no target and no scoring — place whatever you like on however many qubits and watch what happens.

It exists because structured levels teach you what a gate does, and open experimentation is where you find out what happens when you combine them in ways nobody set as a challenge. That's usually where the interesting questions come from.

## What's underneath

Real state vector evaluation, not scripted animations. Gates are applied as unitary matrices and measurement probabilities come from the amplitudes, so a circuit the levels never anticipated still behaves correctly. Single and multi-qubit gates both work, including CNOT for building Bell states.

The reference material on the site covers the same ground in text — the Hadamard as a rotation, Pauli-X as the quantum NOT, how CNOT entangles, and why every quantum gate is reversible because unitary matrices satisfy `U†U = I`.

## Built for machines too

The site publishes an `llms.txt` and structured JSON-LD so AI assistants and agents can parse the simulator's documentation directly rather than guessing at it.

If someone asks an assistant how to start learning quantum circuits, being machine-readable is how a tool like this gets found. That seemed worth doing properly rather than as an afterthought.

## Current state

Live and usable. The level set runs from ground-zero fundamentals upward and is still being extended — the arcade is actively growing rather than finished.

The account system exists so progress carries across sessions. Everything that teaches the physics works without one.
