---
title: Quantum Arcade
tagline: A browser-based quantum circuit simulator. Place gates, run them, and watch the state vector change — no install, no account.
status: live
year: '2026'
access: 'Open the composer and build a circuit. No account needed.'
links:
  site: https://quantum-arcade.web.app/
featured: true
order: 1
---

## What it does

Place quantum gates on a circuit board and see what happens. The simulator evaluates the state vector in real time, so a Hadamard on `|0⟩` shows the probability split to 50/50 as you place it, and a CNOT shows entanglement forming across two qubits.

There are two ways in. **The composer** is a free-form circuit builder — open it and start placing gates. **Missions** are structured challenges with a target state to reach, starting from a single Pauli-X flip and building toward superposition and multi-qubit stabilisation.

Neither requires an account. The composer is the first link on the page.

## Why it exists

Most quantum computing education asks you to install Python, learn a framework's API, and understand linear algebra notation before you can watch a single qubit do anything interesting. That ordering loses people who would have understood the concept fine if they had seen it first.

Superposition is much easier to believe once you have placed an H gate and watched a definite state become a 50/50 probability split — and then placed a second H and watched it collapse back, because `H · H = I`.

## What's underneath

Real state vector evaluation, not scripted animations. Gates are applied as unitary matrices, and measurement probabilities come from the amplitudes rather than a lookup table. Single-qubit and multi-qubit gates both work, including CNOT for building Bell states.

The reference material on the site covers the same ground in text: what the Hadamard does as a rotation, why Pauli-X is the quantum NOT, how CNOT entangles, and why every quantum gate is reversible because unitary matrices satisfy `U†U = I`.

## Built for machines too

The site publishes an `llms.txt` and structured JSON-LD, so AI assistants and agents can parse the simulator's documentation directly rather than guessing at it.

If someone asks an assistant how to learn quantum circuits, being machine-readable is how a tool like this gets found. That felt worth doing properly rather than as an afterthought.

## Current state

Live and usable. Levels run from ground-zero fundamentals upward, and the mission set is still growing — the arcade is being actively extended rather than finished.

The account system exists for progress tracking across sessions. Everything that demonstrates the physics works without one.
