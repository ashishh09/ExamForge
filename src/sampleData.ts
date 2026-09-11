import { ExamPreparationPack, PreparationSetup, UploadedFile } from './types';

export const SAMPLE_STUDY_MATERIALS = [
  {
    id: 'cn',
    name: 'Computer_Networks_Unit_1_to_4_Lecture_Notes.pdf',
    subject: 'Computer Networks',
    type: 'application/pdf',
    size: 2450000,
    formattedSize: '2.4 MB',
    content: `Course: CS304 - Computer Networks & Data Communications
Semester: VI University Examination Syllabus

Unit 1: Fundamentals of Networking & OSI Architecture
- OSI Reference Model (7 Layers): Physical, Data Link, Network, Transport, Session, Presentation, Application.
- Encapsulation and De-capsulation process across protocol stack.
- TCP/IP Protocol Suite vs OSI Model comparison.
- Network Topologies: Star, Mesh, Bus, Ring. Advantages and trade-offs.
- Transmission Media: Guided (Twisted pair, Coaxial, Optical Fiber) and Unguided (Radio, Microwave, Infrared).

Unit 2: Data Link Layer & Medium Access Control
- Framing techniques: Character count, Byte stuffing, Bit stuffing.
- Error Detection and Correction: Parity check, Checksum, Cyclic Redundancy Check (CRC-32), Hamming Code.
- Flow Control Protocols: Stop-and-Wait ARQ, Go-Back-N ARQ, Selective Repeat ARQ. Sliding window concept.
- Multiple Access Protocols: Pure ALOHA, Slotted ALOHA, CSMA, CSMA/CD (Ethernet IEEE 802.3), CSMA/CA (Wireless IEEE 802.11).
- LAN Hardware: Repeaters, Hubs, Bridges, Layer 2 Switches, Routers.

Unit 3: Network Layer & Addressing
- Virtual Circuit vs Datagram Subnets.
- Routing Algorithms: Shortest Path (Dijkstra's Algorithm), Distance Vector Routing (Bellman-Ford), Link State Routing (OSPF), Border Gateway Protocol (BGP).
- IP Addressing: IPv4 Classful & Classless Addressing (CIDR), Subnetting, Supernetting, Subnet Mask calculation.
- IPv6 Header format and transition mechanisms (Dual Stack, Tunneling).
- Address Resolution Protocol (ARP), Reverse ARP (RARP), Internet Control Message Protocol (ICMP).

Unit 4: Transport & Application Layer Protocols
- Transport Layer duties: Process-to-process delivery, Multiplexing/Demultiplexing, Connection management.
- Transmission Control Protocol (TCP): 3-Way Handshake, Connection termination (FIN/ACK), TCP Header format, Flow control using sliding window, TCP Congestion Control (Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery).
- User Datagram Protocol (UDP): Connectionless, lightweight header, Real-time applications vs Reliability.
- Domain Name System (DNS): Hierarchical namespace, Recursive vs Iterative queries.
- HyperText Transfer Protocol (HTTP/1.1 vs HTTP/2 vs HTTP/3), HTTPS with SSL/TLS handshake.
- File Transfer Protocol (FTP) and Simple Mail Transfer Protocol (SMTP/IMAP/POP3).`
  },
  {
    id: 'os',
    name: 'Operating_Systems_Core_Concepts_Exam_Prep.docx',
    subject: 'Operating Systems',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1820000,
    formattedSize: '1.8 MB',
    content: `Course: CS202 - Operating Systems
Syllabus & Comprehensive Study Guide

Module 1: Process Management & CPU Scheduling
- Process states: New, Ready, Running, Waiting, Terminated. Process Control Block (PCB).
- Context Switching overhead and mechanisms.
- Threads: Kernel-level vs User-level threads, Multi-threading models (Many-to-One, One-to-One, Many-to-Many).
- CPU Scheduling Criteria: Turnaround time, Waiting time, Response time, Throughput, CPU Utilization.
- Algorithms: FCFS, Shortest Job First (SJF / SRTF), Priority Scheduling, Round Robin (Time quantum selection), Multi-level Queue Scheduling.

Module 2: Process Synchronization & Concurrency
- Critical Section Problem: Mutual Exclusion, Progress, Bounded Waiting.
- Peterson's Algorithm solution for two processes.
- Semaphores: Counting vs Binary (Mutex) semaphores, Wait() and Signal() operations.
- Classic Synchronization Problems: Producer-Consumer (Bounded Buffer), Readers-Writers problem, Dining Philosophers problem.
- Deadlocks: Necessary conditions (Mutual exclusion, Hold and wait, No preemption, Circular wait).
- Deadlock Handling: Deadlock Prevention, Deadlock Avoidance (Banker's Algorithm), Deadlock Detection & Recovery.

Module 3: Memory Management & Virtual Memory
- Contiguous Memory Allocation: Fixed vs Variable partitioning, First-Fit, Best-Fit, Worst-Fit strategies. Internal vs External Fragmentation.
- Paging: Page table architecture, Translation Lookaside Buffer (TLB), Effective Access Time calculation.
- Segmentation: Logical view of memory, Segment table.
- Virtual Memory: Demand Paging, Page Fault Handling routine.
- Page Replacement Algorithms: FIFO, Optimal Page Replacement (Belady's Anomaly), Least Recently Used (LRU), Clock algorithm.
- Thrashing: Causes, Working-Set Model, Page Fault Frequency.`
  }
];

export function generateExamPackFromText(
  textContent: string,
  setup: PreparationSetup,
  fileName: string
): ExamPreparationPack {
  const isNetworking = textContent.toLowerCase().includes('network') || textContent.toLowerCase().includes('osi') || textContent.toLowerCase().includes('tcp');
  const subject = setup.subjectName || (isNetworking ? 'Computer Networks' : 'Operating Systems');
  const totalMarks = setup.sections.reduce((acc, s) => acc + s.questionCount * s.marksPerQuestion, 0) || 50;

  if (isNetworking) {
    return {
      metadata: {
        generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        subject,
        fileName,
        difficulty: setup.difficulty,
        totalMarks
      },
      importantQuestions: [
        {
          id: 'iq-1',
          question: 'Explain the OSI Reference Model and detail the specific functions and protocols of each layer.',
          marks: 10,
          priority: 'HIGH PRIORITY',
          category: 'Network Architecture',
          probability: '98% Frequency in Past 5 Years',
          summaryAnswer: 'The Open Systems Interconnection (OSI) model comprises 7 distinct abstraction layers structured hierarchically from physical transmission to user interfaces.',
          detailedAnswer: `### 1. Introduction
The **Open Systems Interconnection (OSI)** model was developed by the International Organization for Standardization (ISO) in 1984. It structures network communication into **seven discrete layers**, standardizing protocols and ensuring multi-vendor interoperability.

### 2. The Seven Layers (Bottom to Top)
1. **Physical Layer (Layer 1):**
   - Transmits raw, unstructured bit streams over physical transmission media.
   - Defines electrical voltages, pin configurations, cable impedance, and modulation techniques.
   - *Hardware/Protocols:* RJ-45, Ethernet 100BASE-TX, Fiber optic cables, Repeaters.

2. **Data Link Layer (Layer 2):**
   - Provides node-to-node data transfer, framing, physical MAC addressing, and error detection.
   - Sub-divided into **LLC (Logical Link Control)** and **MAC (Medium Access Control)**.
   - *Hardware/Protocols:* Ethernet (IEEE 802.3), Wi-Fi (IEEE 802.11), Switches, Bridges.

3. **Network Layer (Layer 3):**
   - Responsible for host-to-host packet routing across heterogeneous networks and logical addressing.
   - Computes optimal paths using Dijkstra or Bellman-Ford algorithms.
   - *Protocols:* IPv4, IPv6, ICMP, OSPF, BGP, Routers.

4. **Transport Layer (Layer 4):**
   - Guarantees end-to-end process-to-process message delivery with port addressing.
   - Provides segment reassembly, flow control (Sliding Window), and congestion control.
   - *Protocols:* TCP (Connection-oriented, reliable), UDP (Connectionless, datagram).

5. **Session Layer (Layer 5):**
   - Establishes, manages, synchronizes, and terminates inter-application dialogue sessions.
   - Inserts check points into data streams to recover from transmission aborts.
   - *Protocols:* RPC, NetBIOS, PPTP.

6. **Presentation Layer (Layer 6):**
   - Serves as the syntax and semantics translator of exchanged messages.
   - Handles data serialization (JSON, ASN.1), compression (gzip), and cryptographic encryption/decryption (SSL/TLS).

7. **Application Layer (Layer 7):**
   - Closest to the end user; directly interfaces with software applications to provide network services.
   - *Protocols:* HTTP/HTTPS, DNS, SMTP, SSH, FTP.`
        },
        {
          id: 'iq-2',
          question: 'Compare TCP and UDP in detail. Illustrate the TCP 3-way handshake connection establishment mechanism.',
          marks: 8,
          priority: 'HIGH PRIORITY',
          category: 'Transport Layer',
          probability: '94% High Exam Recurrence',
          summaryAnswer: 'TCP is a connection-oriented, byte-stream protocol ensuring reliable delivery, while UDP is a lightweight, connectionless datagram protocol without flow or congestion control.',
          detailedAnswer: `### 1. Comparative Analysis

| Feature | Transmission Control Protocol (TCP) | User Datagram Protocol (UDP) |
| :--- | :--- | :--- |
| **Connection Type** | Connection-oriented (requires setup & teardown) | Connectionless (no preliminary handshake) |
| **Reliability** | Guaranteed delivery via ACKs & retransmissions | Best-effort delivery; packet loss may occur |
| **Header Overhead** | 20 to 60 Bytes | Fixed 8 Bytes |
| **Flow & Congestion Control** | Supported (Sliding window & Slow-start) | Not supported |
| **Speed & Latency** | Higher latency due to acknowledgements | Extremely fast, minimal latency |
| **Use Cases** | Web (HTTP/S), Email (SMTP), File Transfer (FTP) | Live streaming, DNS lookups, Online gaming, VoIP |

### 2. TCP Three-Way Handshake
To establish an active synchronized connection:
1. **SYN (Synchronize):** Client sends a packet with \`SYN = 1\`, generating an initial random sequence number \`Seq = x\`.
2. **SYN-ACK (Synchronize-Acknowledge):** Server receives the SYN, allocates socket buffers, and responds with \`SYN = 1\`, \`ACK = 1\`, setting \`Ack = x + 1\` and server's initial sequence number \`Seq = y\`.
3. **ACK (Acknowledge):** Client responds with \`ACK = 1\`, \`Seq = x + 1\`, and \`Ack = y + 1\`. Both endpoints are now in the **ESTABLISHED** state.`
        },
        {
          id: 'iq-3',
          question: 'What is Subnetting? Given the network address 192.168.10.0/24, create 4 equal-sized subnets and determine their network addresses, broadcast addresses, and usable host ranges.',
          marks: 6,
          priority: 'HIGH PRIORITY',
          category: 'Network Layer Addressing',
          probability: '89% Numerical Essential',
          summaryAnswer: 'Subnetting divides a large broadcast domain into smaller logical subnetworks to conserve IP addresses and minimize collision overhead.',
          detailedAnswer: `### 1. Subnetting Calculations
- Base Network: **192.168.10.0/24**
- Required Subnets: **4 subnets**
- Subnet Bits Borrowed: $2^n \\ge 4 \\implies n = 2$ bits.
- New Subnet Mask: $/24 + 2 = /26$ (i.e. **255.255.255.192**).
- Block Size: $256 - 192 = 64$ addresses per subnet.
- Usable Hosts per Subnet: $2^{(32 - 26)} - 2 = 64 - 2 = 62$ hosts.

### 2. Subnet Allocation Table
- **Subnet 1:**
  - Network Address: \`192.168.10.0\`
  - Usable Host Range: \`192.168.10.1\` to \`192.168.10.62\`
  - Directed Broadcast: \`192.168.10.63\`
- **Subnet 2:**
  - Network Address: \`192.168.10.64\`
  - Usable Host Range: \`192.168.10.65\` to \`192.168.10.126\`
  - Directed Broadcast: \`192.168.10.127\`
- **Subnet 3:**
  - Network Address: \`192.168.10.128\`
  - Usable Host Range: \`192.168.10.129\` to \`192.168.10.190\`
  - Directed Broadcast: \`192.168.10.191\`
- **Subnet 4:**
  - Network Address: \`192.168.10.192\`
  - Usable Host Range: \`192.168.10.193\` to \`192.168.10.254\`
  - Directed Broadcast: \`192.168.10.255\``
        },
        {
          id: 'iq-4',
          question: 'Explain the working of CSMA/CD and describe the binary exponential backoff algorithm.',
          marks: 5,
          priority: 'MEDIUM PRIORITY',
          category: 'Data Link Layer & MAC',
          probability: '82% Core Topic',
          summaryAnswer: 'Carrier Sense Multiple Access with Collision Detection allows nodes to listen before transmitting and detect frame collision events mid-transmission.',
          detailedAnswer: `### 1. Principle of CSMA/CD
Carrier Sense Multiple Access with Collision Detection operates via three rules:
- **Carrier Sense:** Stations continuously monitor the transmission line. If busy, transmission is deferred.
- **Multiple Access:** Multiple transceivers share an identical physical wire bus.
- **Collision Detection:** Stations listen while transmitting. If signal energy exceeds normal threshold, a collision is detected.

### 2. Binary Exponential Backoff Algorithm
Upon collision detection:
1. The station immediately ceases transmission and broadcasts a **32-bit jam signal**.
2. Collision counter $k$ increments by 1 (up to $k_{max} = 10$).
3. Station selects a random backoff integer $R$ from range $[0, 2^k - 1]$.
4. The station waits $R \\times 51.2\\,\\mu s$ (the slot time for 10 Mbps Ethernet) before attempting retransmission.
5. If collisions persist past 16 attempts ($k = 16$), the transmission is aborted with a link failure error.`
        },
        {
          id: 'iq-5',
          question: 'Differentiate between Distance Vector Routing and Link State Routing algorithms.',
          marks: 5,
          priority: 'MEDIUM PRIORITY',
          category: 'Routing Protocols',
          probability: '78% Conceptual Contrast',
          summaryAnswer: 'Distance Vector routes by neighboring vector sharing (Bellman-Ford), whereas Link State constructs a global network topology map (Dijkstra).',
          detailedAnswer: `### Core Contrasts:
1. **Information Shared:**
   - *Distance Vector:* Shares entire routing table, but only with direct physical neighbors.
   - *Link State:* Shares status of immediate links only, but broadcasts to all routers in the autonomous domain via Link State Packets (LSPs).
2. **Underlying Algorithm:**
   - *Distance Vector:* Bellman-Ford algorithm ($O(V \\cdot E)$ complexity). Vulnerable to Count-to-Infinity problems.
   - *Link State:* Dijkstra's Shortest Path First algorithm ($O(E \\log V)$ complexity).
3. **Convergence Speed:**
   - *Distance Vector:* Slow convergence, susceptible to transient loops (mitigated by Split Horizon and Poison Reverse).
   - *Link State:* Fast, consistent convergence with zero routing loops.
4. **Protocols:**
   - *Distance Vector:* Routing Information Protocol (RIP).
   - *Link State:* Open Shortest Path First (OSPF), IS-IS.`
        },
        {
          id: 'iq-6',
          question: 'Define Cyclic Redundancy Check (CRC). Given a dataword 1101011011 and generator polynomial G(x) = x^4 + x + 1, compute the transmitted codeword.',
          marks: 4,
          priority: 'EXPECTED',
          category: 'Error Detection',
          probability: '75% Mathematical Pattern',
          summaryAnswer: 'CRC is a polynomial division error detection code using modulo-2 arithmetic to generate a checksum appended to data.',
          detailedAnswer: `### 1. Calculation
- Dataword: \`1101011011\` ($k = 10$ bits)
- Generator Polynomial: $G(x) = x^4 + x + 1 \\implies 10011_2$ ($r = 4$ degree)
- Appended zeroes: Add $r = 4$ zeros $\\implies 11010110110000$
- Perform Modulo-2 polynomial division (XOR operation without carry)
- Remainder obtained: \`1110\` (4 bits)
- Codeword Transmitted: Dataword + Remainder = \`11010110111110\`.`
        }
      ],
      shortNotes: [
        {
          id: 'sn-1',
          title: 'Address Resolution Protocol (ARP) & RARP',
          summary: 'Dynamically maps 32-bit logical IPv4 addresses to 48-bit physical MAC hardware addresses on local area subnets.',
          bulletPoints: [
            'ARP operates between Layer 2 and Layer 3 of the protocol stack.',
            'Sends an **ARP Request as a broadcast** frame (Destination MAC: FF:FF:FF:FF:FF:FF).',
            'Target node replies with an **ARP Reply via unicast** containing its physical MAC address.',
            'Stores bindings in a temporary local **ARP Cache** with TTL to prevent recurring broadcast storms.'
          ],
          keyTerms: ['Broadcast Frame', 'Unicast Response', 'ARP Cache Table', 'Gratuitous ARP']
        },
        {
          id: 'sn-2',
          title: 'Domain Name System (DNS) Resolution Hierarchy',
          summary: 'Distributed hierarchical database system converting human-readable domain names into machine-routable IP addresses.',
          bulletPoints: [
            'Hierarchical tree: Root Domain (.) -> Top-Level Domain (.com, .edu, .org) -> Second-Level Domain -> Subdomains.',
            'Supports **Recursive Queries** (resolver does all work) and **Iterative Queries** (client queries each authority sequentially).',
            'Uses UDP Port 53 for standard lookups and TCP Port 53 for zone transfers (> 512 bytes).',
            'Record Types: **A** (IPv4), **AAAA** (IPv6), **CNAME** (Canonical alias), **MX** (Mail exchanger), **NS** (Name server).'
          ],
          keyTerms: ['Recursive Lookup', 'Iterative Query', 'Authoritative Server', 'TTL Caching']
        },
        {
          id: 'sn-3',
          title: 'Sliding Window Protocol & Flow Control',
          summary: 'Sender transmits multiple frames before receiving acknowledgements, optimizing network bandwidth utilization.',
          bulletPoints: [
            'Overcomes the idle channel latency of Stop-and-Wait protocols.',
            '**Go-Back-N ARQ:** Sender window size $N$, receiver window size 1. Out-of-order packets are discarded; retransmits from lost packet onwards.',
            '**Selective Repeat ARQ:** Both sender and receiver window size $N$. Discarded frames are individually buffered and retransmitted.',
            'Maximum window size condition: $W_s + W_r \\le 2^m$ where $m$ is sequence number bit width.'
          ],
          keyTerms: ['Window Size', 'Cumulative ACK', 'Selective ACK', 'Bandwidth-Delay Product']
        },
        {
          id: 'sn-4',
          title: 'Network Address Translation (NAT) & PAT',
          summary: 'Enables private RFC 1918 local IP addresses to share one or a small pool of globally unique public IP addresses.',
          bulletPoints: [
            'Preserves the depletion of scarce IPv4 32-bit address space.',
            '**Port Address Translation (PAT / NAT Overload):** Uses unique source layer-4 port numbers to multiplex thousands of internal hosts onto one public IP.',
            'Maintains a Translation Mapping Table in the gateway router.',
            'Provides implicit inbound network shielding by dropping unsolicited connection attempts.'
          ],
          keyTerms: ['Private IP Space', 'PAT Overload', 'NAT Translation Table', 'IPv4 Depletion']
        }
      ],
      longAnswers: [
        {
          id: 'la-1',
          question: 'Discuss TCP Congestion Control mechanisms in comprehensive detail, including Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.',
          marks: 10,
          category: 'Transport Layer Mechanics',
          introduction: 'Congestion occurs when network load exceeds available link capacities. TCP prevents network collapse using dynamic Congestion Window (cwnd) rate adjustment algorithms.',
          bodySections: [
            {
              heading: '1. Core Variables and State Indicators',
              points: [
                '**cwnd (Congestion Window):** Imposed by the sender to limit bytes in-flight according to network state.',
                '**rwnd (Receiver Window):** Advertised by the receiver to prevent buffer overrun flow issues.',
                '**Effective Transmission Limit:** Sender limits traffic to `min(cwnd, rwnd)`.',
                '**ssthresh (Slow-Start Threshold):** The boundary metric toggling exponential and linear window growth.'
              ]
            },
            {
              heading: '2. Slow Start Phase',
              points: [
                'Initial state: `cwnd = 1 MSS` (Maximum Segment Size).',
                'For each ACK received, cwnd increments by 1 MSS: doubling cwnd every Round Trip Time (RTT).',
                'Exponential growth continues uninterrupted until `cwnd >= ssthresh` or a packet loss occurs.'
              ]
            },
            {
              heading: '3. Congestion Avoidance Phase',
              points: [
                'Begins immediately when `cwnd` reaches or crosses `ssthresh`.',
                'Additive Increase: `cwnd` grows linearly by approximately `1 MSS per RTT` (or `MSS * (MSS / cwnd)` per ACK).',
                'Probes network capacity prudently without inducing immediate buffer overflows.'
              ]
            },
            {
              heading: '4. Loss Detection & Recovery (Tahoe vs Reno)',
              points: [
                '**Timeout (Severe Congestion):** Retransmission Timer expires. `ssthresh` drops to `cwnd / 2`, and `cwnd` resets to `1 MSS` (entering Slow Start).',
                '**3 Duplicate ACKs (Mild Congestion):** Indicates segments beyond a missing packet reached receiver.',
                '**Fast Retransmit:** Sender retransmits the missing segment immediately without awaiting the RTO timer.',
                '**Fast Recovery (TCP Reno):** Sets `ssthresh = cwnd / 2`, sets `cwnd = ssthresh + 3 MSS`, continuing Congestion Avoidance without dropping back to 1 MSS.'
              ]
            }
          ],
          conclusion: 'These complementary algorithms allow TCP to achieve high throughput across diverse Internet topologies while remaining fair to concurrent flows.',
          diagramOrStructure: `[Initial cwnd=1] -> (Exponential Growth) -> [ssthresh Reached] -> (Linear Additive Increase) -> [3 Dup ACKs: Fast Recovery] OR [Timeout: Reset cwnd=1]`
        }
      ],
      definitions: [
        {
          id: 'def-1',
          term: 'Bandwidth-Delay Product (BDP)',
          definition: 'The product of a data link bandwidth and its round-trip propagation delay, representing the maximum volume of unacknowledged data in-flight that can fill the transmission pipe.',
          keyKeywords: ['Bandwidth', 'Propagation Delay', 'In-Flight Data', 'Pipe Capacity'],
          exampleOrFormula: 'BDP = Bandwidth (bps) × RTT (seconds)',
          marks: 2
        },
        {
          id: 'def-2',
          term: 'Cyclic Redundancy Check (CRC)',
          definition: 'A mathematical polynomial division algorithm used at the Data Link Layer to detect single-bit, double-bit, and burst errors in transmitted digital frames.',
          keyKeywords: ['Modulo-2 Arithmetic', 'Generator Polynomial', 'Frame Check Sequence', 'Burst Errors'],
          exampleOrFormula: 'Codeword = (Dataword × 2^r) XOR Remainder',
          marks: 2
        },
        {
          id: 'def-3',
          term: 'Autonomous System (AS)',
          definition: 'A connected group of IP networks and routers managed under a single technical administration and unified routing policy, usually operating internal IGPs and external BGPs.',
          keyKeywords: ['Unified Administration', 'Routing Policy', 'BGP', 'AS Number'],
          exampleOrFormula: 'Identified globally by a 16-bit or 32-bit ASN assigned by IANA.',
          marks: 2
        },
        {
          id: 'def-4',
          term: 'MAC Address (Media Access Control)',
          definition: 'A globally unique 48-bit (6-byte) physical hardware address hardcoded into the network interface controller (NIC) by the hardware manufacturer for Layer 2 communications.',
          keyKeywords: ['48-bit', 'Physical Address', 'NIC', 'OUI + Vendor Specified'],
          exampleOrFormula: 'Example: 00:1A:2B:3C:4D:5E (First 3 bytes = OUI manufacturer identifier)',
          marks: 2
        },
        {
          id: 'def-5',
          term: 'Subnet Mask',
          definition: 'A 32-bit bitmask utilized in IP networking to segregate the network portion of an IP address from the host portion, identifying whether a target IP resides locally or remotely.',
          keyKeywords: ['Bitmask', 'Network ID', 'Host ID', 'CIDR Prefix'],
          exampleOrFormula: '255.255.255.0 equates to a /24 network prefix.',
          marks: 2
        },
        {
          id: 'def-6',
          term: 'Jitter',
          definition: 'The statistical variation or packet arrival delay variance over time across a network link, critical for real-time interactive voice (VoIP) and video streaming streams.',
          keyKeywords: ['Delay Variance', 'Buffer Underrun', 'Packet Arrival', 'QoS Metric'],
          exampleOrFormula: 'Calculated as |D(i, j)| = |(R_j - S_j) - (R_i - S_i)|',
          marks: 2
        }
      ],
      keyPoints: [
        {
          id: 'kp-1',
          topic: 'OSI vs TCP/IP Protocol Layers',
          points: [
            'OSI defines 7 conceptual reference layers; TCP/IP defines 4 practical implementation layers.',
            'OSI strictly distinguishes service, interface, and protocols; TCP/IP merges Application, Presentation, and Session into a unified Application Layer.',
            'Transport layer in OSI supports connection-oriented and connectionless; TCP/IP supports TCP (connection-oriented) and UDP (connectionless).',
            'Network layer in OSI supports both connectionless and connection-oriented; TCP/IP Network (Internet) layer strictly uses connectionless IP.'
          ]
        },
        {
          id: 'kp-2',
          topic: 'IPv4 vs IPv6 Architectural Differences',
          points: [
            'Address length: IPv4 uses 32 bits (4.29 billion total); IPv6 uses 128 bits (3.4 × 10^38 total addresses).',
            'Header size: IPv4 header is variable (20-60 bytes); IPv6 header is fixed at 40 bytes for rapid hardware parsing.',
            'Checksum: IPv4 includes header checksum computed at every hop; IPv6 eliminates header checksum to accelerate forwarding throughput.',
            'Fragmentation: In IPv4, both routers and senders can fragment; in IPv6, only the source sender fragments (using Path MTU discovery).'
          ]
        }
      ],
      sampleQuestions: [
        {
          id: 'sq-1',
          question: 'A sender using Go-Back-N ARQ has a window size of 4. Frames 0, 1, 2, 3 are transmitted. ACK 1 is received, but frame 2 is damaged. What does the sender retransmit upon timeout?',
          marks: 4,
          type: 'Numerical / Analytical',
          hintOrGuideline: 'Remember that Go-Back-N does not buffer out-of-order frames at the receiver end.',
          solution: 'In Go-Back-N ARQ, the receiver discards all subsequent frames following a missing frame without buffering. Therefore, upon timer expiration for Frame 2, the sender must go back and retransmit all unacknowledged frames in the active window: Frames 2 and 3.'
        },
        {
          id: 'sq-2',
          question: 'Why does DNS use UDP for standard queries but switches to TCP for zone transfers and messages exceeding 512 bytes?',
          marks: 4,
          type: 'Conceptual',
          hintOrGuideline: 'Evaluate connection setup overhead versus transmission reliability and buffer size constraints.',
          solution: 'Standard queries prioritize speed and low latency; a single UDP request-reply avoids the 3-way handshake delay. Zone transfers require absolute reliability and transfer large database records exceeding 512 bytes, which necessitates TCP connection streaming.'
        }
      ],
      questionPaper: {
        institution: 'EXAMFORGE AI UNIVERSITY MODEL EXAMINATION',
        examination: 'B.TECH DEGREE SEMESTER EXAMINATION',
        subject: 'CS304: COMPUTER NETWORKS & DATA COMMUNICATIONS',
        timeAllowed: '3 Hours',
        maximumMarks: 50,
        instructions: [
          'Answer ALL questions from Section A (2 marks each).',
          'Answer any FOUR questions from Section B (5 marks each).',
          'Answer any TWO questions from Section C (10 marks each).',
          'Assume suitable data wherever necessary and state assumptions clearly.',
          'Draw neat diagrams and schematics wherever applicable.'
        ],
        sections: [
          {
            name: 'SECTION A',
            instruction: 'Answer ALL questions. Each question carries 2 marks.',
            totalMarks: 10,
            questions: [
              { questionNumber: 'Q1', text: 'Define Bandwidth-Delay Product (BDP) and state its physical significance in network pipe capacity.', marks: 2 },
              { questionNumber: 'Q2', text: 'Distinguish between pure ALOHA and slotted ALOHA with respect to their maximum theoretical channel throughput.', marks: 2 },
              { questionNumber: 'Q3', text: 'What is the purpose of the TTL (Time to Live) field in an IPv4 datagram header?', marks: 2 },
              { questionNumber: 'Q4', text: 'Explain why UDP is preferred over TCP for real-time multiplayer gaming and voice communications.', marks: 2 },
              { questionNumber: 'Q5', text: 'Define Subnet Mask and explain how CIDR notation /26 is converted to dotted decimal format.', marks: 2 }
            ]
          },
          {
            name: 'SECTION B',
            instruction: 'Answer any FOUR questions. Each question carries 5 marks.',
            totalMarks: 20,
            questions: [
              { questionNumber: 'Q6', text: 'Explain the working principle of CSMA/CD and the binary exponential backoff algorithm utilized in Ethernet networks.', marks: 5 },
              { questionNumber: 'Q7', text: 'Given an IP network 192.168.1.0/24, calculate the subnet mask and host ranges to create 4 equal-sized subnets.', marks: 5 },
              { questionNumber: 'Q8', text: 'Compare the Go-Back-N and Selective Repeat sliding window flow control protocols with appropriate frame diagrams.', marks: 5 },
              { questionNumber: 'Q9', text: 'Differentiate between Distance Vector Routing and Link State Routing algorithms based on routing overhead and convergence speed.', marks: 5 },
              { questionNumber: 'Q10', text: 'Describe the complete DNS resolution process distinguishing between recursive and iterative query mechanisms.', marks: 5 }
            ]
          },
          {
            name: 'SECTION C',
            instruction: 'Answer any TWO questions. Each question carries 10 marks.',
            totalMarks: 20,
            questions: [
              { questionNumber: 'Q11', text: 'Draw and explain the 7-layer OSI Reference Model in detail, clearly enumerating the core functions and associated protocols at each layer.', marks: 10 },
              { questionNumber: 'Q12', text: 'Explain TCP Congestion Control mechanisms in detail, highlighting the operational distinctions between Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.', marks: 10 },
              { questionNumber: 'Q13', text: 'Illustrate the TCP 3-way handshake connection establishment and 4-way connection termination mechanisms, along with state transition descriptions.', marks: 10 }
            ]
          }
        ]
      },
      answerKey: [
        {
          id: 'ak-1',
          questionNumber: 'Q1',
          sectionName: 'SECTION A',
          questionText: 'Define Bandwidth-Delay Product (BDP) and state its physical significance.',
          marks: 2,
          markingScheme: [
            { step: 'Definition & formula', marksAllocated: '1 Mark' },
            { step: 'Physical significance & pipe capacity', marksAllocated: '1 Mark' }
          ],
          modelAnswer: 'The Bandwidth-Delay Product (BDP) is the product of a link\'s transmission capacity (bandwidth in bps) and its round-trip propagation delay (RTT in seconds). BDP represents the total volume of unacknowledged data in flight required to completely fill the transmission pipeline.',
          bulletPoints: [
            'Formula: BDP = Bandwidth × RTT',
            'Significance: Determines optimal buffer and TCP sliding window sizing to avoid link underutilization.'
          ]
        },
        {
          id: 'ak-2',
          questionNumber: 'Q2',
          sectionName: 'SECTION A',
          questionText: 'Distinguish between pure ALOHA and slotted ALOHA with respect to maximum throughput.',
          marks: 2,
          markingScheme: [
            { step: 'Pure ALOHA equation and 18.4% limit', marksAllocated: '1 Mark' },
            { step: 'Slotted ALOHA synchronization and 36.8% limit', marksAllocated: '1 Mark' }
          ],
          modelAnswer: 'Pure ALOHA permits nodes to transmit at will, resulting in a vulnerable period of 2T and maximum efficiency S = 1/(2e) ≈ 18.4%. Slotted ALOHA divides time into discrete slots, halving vulnerable period to T and doubling maximum efficiency S = 1/e ≈ 36.8%.',
          bulletPoints: [
            'Pure ALOHA: Vulnerable period = 2 × Frame Time, Max throughput = 18.4%.',
            'Slotted ALOHA: Vulnerable period = 1 × Frame Time, Max throughput = 36.8%.'
          ]
        },
        {
          id: 'ak-3',
          questionNumber: 'Q3',
          sectionName: 'SECTION A',
          questionText: 'What is the purpose of the TTL (Time to Live) field in an IPv4 datagram header?',
          marks: 2,
          markingScheme: [
            { step: 'Prevent routing loops', marksAllocated: '1 Mark' },
            { step: 'Decrement mechanism and ICMP Time Exceeded', marksAllocated: '1 Mark' }
          ],
          modelAnswer: 'The 8-bit TTL field prevents circulating datagrams from looping indefinitely during routing convergence anomalies. Every intermediate router decrements TTL by 1. When TTL reaches 0, the packet is discarded and an ICMP Type 11 Time Exceeded packet is dispatched back to the source.',
          bulletPoints: [
            'Loop prevention in multi-hop networks.',
            'Triggers ICMP Time Exceeded (used by traceroute utility).'
          ]
        },
        {
          id: 'ak-4',
          questionNumber: 'Q4',
          sectionName: 'SECTION A',
          questionText: 'Explain why UDP is preferred over TCP for real-time multiplayer gaming and voice communications.',
          marks: 2,
          markingScheme: [
            { step: 'Absence of handshake and retransmission latency', marksAllocated: '1 Mark' },
            { step: 'Tolerance of dropped packets in real-time streams', marksAllocated: '1 Mark' }
          ],
          modelAnswer: 'Real-time media and gaming applications prioritize low latency and timely delivery over guaranteed packet arrival. TCP introduces head-of-line blocking and delayed retransmissions, which degrade user experience. UDP sends data immediately without handshake or retransmission lag.',
          bulletPoints: [
            'Zero connection setup latency (no 3-way handshake).',
            'No Head-of-Line blocking (stale packets dropped rather than stalled).'
          ]
        },
        {
          id: 'ak-5',
          questionNumber: 'Q5',
          sectionName: 'SECTION A',
          questionText: 'Define Subnet Mask and explain how CIDR notation /26 is converted to dotted decimal format.',
          marks: 2,
          markingScheme: [
            { step: 'Subnet mask definition', marksAllocated: '1 Mark' },
            { step: 'CIDR /26 binary and decimal conversion', marksAllocated: '1 Mark' }
          ],
          modelAnswer: 'A subnet mask is a 32-bit integer distinguishing the network identifier bits from host identifier bits. In /26 notation, the first 26 bits are binary 1s: 11111111.11111111.11111111.11000000. In dotted decimal format, this equals 255.255.255.192.',
          bulletPoints: [
            '26 consecutive 1s followed by 6 zeros.',
            'Last octet: 128 + 64 = 192, yielding 255.255.255.192.'
          ]
        },
        {
          id: 'ak-6',
          questionNumber: 'Q6',
          sectionName: 'SECTION B',
          questionText: 'Explain the working principle of CSMA/CD and the binary exponential backoff algorithm.',
          marks: 5,
          markingScheme: [
            { step: 'Carrier sense & collision detection logic', marksAllocated: '2.5 Marks' },
            { step: 'Backoff interval formula and max attempts', marksAllocated: '2.5 Marks' }
          ],
          modelAnswer: 'CSMA/CD monitors channel carrier state before and during transmission. Upon simultaneous transmission, voltage spikes trigger collision detection. Both stations halt transmission, send a 32-bit jam signal, and invoke the Binary Exponential Backoff algorithm: picking a random delay R in range [0, 2^k - 1] where k = min(attempt, 10). Waiting time = R × 51.2 µs.',
          bulletPoints: [
            'Listen-while-talk hardware detection.',
            'Randomized backoff spreads conflicting retransmission attempts.',
            'Abort after 16 unsuccessful attempts.'
          ]
        },
        {
          id: 'ak-7',
          questionNumber: 'Q7',
          sectionName: 'SECTION B',
          questionText: 'Given network 192.168.1.0/24, calculate subnet mask and host ranges for 4 subnets.',
          marks: 5,
          markingScheme: [
            { step: 'Bits calculation and new mask /26', marksAllocated: '2 Marks' },
            { step: 'Subnet breakdown table with 4 ranges', marksAllocated: '3 Marks' }
          ],
          modelAnswer: 'To create 4 subnets from /24, borrow 2 bits (2^2 = 4). New mask is /26 (255.255.255.192). Block size is 64 addresses. Usable hosts = 64 - 2 = 62 hosts per subnet. Subnet 1: 192.168.1.0 (Hosts: 1-62, Broadcast: 63). Subnet 2: 192.168.1.64 (Hosts: 65-126, Broadcast: 127). Subnet 3: 192.168.1.128 (Hosts: 129-190, Broadcast: 191). Subnet 4: 192.168.1.192 (Hosts: 193-254, Broadcast: 255).',
          bulletPoints: [
            'Borrow 2 bits from host octet.',
            '62 usable host addresses per subnetwork.'
          ]
        },
        {
          id: 'ak-8',
          questionNumber: 'Q11',
          sectionName: 'SECTION C',
          questionText: 'Draw and explain the 7-layer OSI Reference Model in detail with functions and protocols.',
          marks: 10,
          markingScheme: [
            { step: 'Model architectural schematic & overview', marksAllocated: '2 Marks' },
            { step: 'Lower layers (Physical, Data Link, Network)', marksAllocated: '4 Marks' },
            { step: 'Upper layers (Transport, Session, Presentation, Application)', marksAllocated: '4 Marks' }
          ],
          modelAnswer: 'The ISO OSI 7-layer model categorizes networking into: 1. Physical (raw bit transmission, cables, voltages), 2. Data Link (framing, MAC addressing, error detection, switches), 3. Network (routing, IP addressing, OSPF, packet forwarding), 4. Transport (end-to-end reliability, TCP/UDP, flow control), 5. Session (dialog control, checkpoints, session restoration), 6. Presentation (data translation, encryption, SSL/TLS, compression), 7. Application (direct user service access, HTTP, DNS, SMTP). Encapsulation attaches headers downwards, and decapsulation strips headers upwards.',
          bulletPoints: [
            'Clean separation between physical hardware, transport abstractions, and application logic.',
            'Encapsulation and PDU names: Bits -> Frames -> Packets -> Segments -> Data.'
          ]
        },
        {
          id: 'ak-9',
          questionNumber: 'Q12',
          sectionName: 'SECTION C',
          questionText: 'Explain TCP Congestion Control mechanisms in detail: Slow Start, Avoidance, Fast Retransmit/Recovery.',
          marks: 10,
          markingScheme: [
            { step: 'Problem statement & cwnd / rwnd variables', marksAllocated: '2 Marks' },
            { step: 'Slow Start exponential & Congestion Avoidance linear phases', marksAllocated: '4 Marks' },
            { step: 'Fast Retransmit & Fast Recovery with 3 duplicate ACKs', marksAllocated: '4 Marks' }
          ],
          modelAnswer: 'TCP Congestion Control maintains `cwnd` to prevent buffer overflow. In Slow Start, cwnd begins at 1 MSS and doubles every RTT until reaching `ssthresh`. In Congestion Avoidance, growth becomes additive (+1 MSS per RTT). Upon packet loss signaled by 3 duplicate ACKs, Fast Retransmit resends the packet immediately without timer expiration, and Fast Recovery sets `ssthresh = cwnd/2` and keeps cwnd high rather than dropping to 1 MSS, preserving link utilization.',
          bulletPoints: [
            'AIMD: Additive Increase, Multiplicative Decrease.',
            'Prevents catastrophic congestion collapse on shared routers.'
          ]
        }
      ]
    };
  }

  // Generic/Operating Systems fallback
  return {
    metadata: {
      generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      subject,
      fileName,
      difficulty: setup.difficulty,
      totalMarks
    },
    importantQuestions: [
      {
        id: 'iq-os-1',
        question: 'Explain the concept of Deadlocks. State the four necessary Coffman conditions and explain Banker\'s algorithm for deadlock avoidance.',
        marks: 10,
        priority: 'HIGH PRIORITY',
        category: 'Concurrency & Deadlocks',
        probability: '96% Core Topic',
        summaryAnswer: 'A deadlock occurs when processes hold resources while waiting for other held resources. Banker\'s algorithm ensures safety before granting requests.',
        detailedAnswer: `### 1. The Four Necessary Coffman Conditions
1. **Mutual Exclusion:** At least one resource must be held in a non-shareable mode.
2. **Hold and Wait:** A process must currently hold at least one resource and be requesting additional resources held by other processes.
3. **No Preemption:** Resources cannot be forcibly preempted; they can only be released voluntarily by the holding process.
4. **Circular Wait:** A closed chain of processes exists such that each process holds resources needed by the next process in the cycle.

### 2. Banker's Algorithm (Dijkstra)
- Maintains state vectors: **Available**, **Max**, **Allocation**, and **Need = Max - Allocation**.
- Evaluates if allocation leaves system in a **Safe State** (a sequence exists where all processes can finish).`
      },
      {
        id: 'iq-os-2',
        question: 'Compare Preemptive and Non-preemptive CPU scheduling. Calculate average waiting time for FCFS, SJF, and Round Robin (Time Quantum = 2ms).',
        marks: 8,
        priority: 'HIGH PRIORITY',
        category: 'CPU Scheduling',
        probability: '92% Recurring Numerical',
        summaryAnswer: 'Preemptive scheduling allows interrupting running processes, while non-preemptive lets processes run until voluntary release or termination.',
        detailedAnswer: `### Comparison
- **Preemptive:** CPU can be seized by higher priority or lower burst jobs (e.g., Round Robin, SRTF). Prevents CPU monopolization.
- **Non-Preemptive:** Process retains CPU until I/O wait or termination (e.g., FCFS, Non-preemptive SJF). Simple with minimal context switch overhead.`
      }
    ],
    shortNotes: [
      {
        id: 'sn-os-1',
        title: 'Virtual Memory & Demand Paging',
        summary: 'Permits execution of processes not entirely resident in physical RAM by swapping pages on demand.',
        bulletPoints: [
          'Pages loaded only when referenced (lazy swapper).',
          'Page Fault Trap occurs when referenced page has invalid bit in page table.',
          'Operating system retrieves page from swap disk space and updates table.',
          'Effective Access Time = (1 - p) × Memory Access Time + p × Page Fault Service Time.'
        ],
        keyTerms: ['Page Fault', 'Valid/Invalid Bit', 'Swap Space', 'Effective Access Time']
      },
      {
        id: 'sn-os-2',
        title: 'Semaphores vs Mutex Locks',
        summary: 'Synchronization primitives used to solve critical section races and maintain mutual exclusion.',
        bulletPoints: [
          '**Mutex:** Binary lock with ownership property (only the locker can unlock).',
          '**Counting Semaphore:** Integer value initialized to resource count; wait() decrements, signal() increments.',
          'Prevents race conditions in shared multi-threaded memory environments.'
        ],
        keyTerms: ['Critical Section', 'Wait() / P()', 'Signal() / V()', 'Priority Inversion']
      }
    ],
    longAnswers: [
      {
        id: 'la-os-1',
        question: 'Describe Paging hardware with Translation Lookaside Buffer (TLB) and calculate Effective Memory Access Time.',
        marks: 10,
        category: 'Memory Management Architecture',
        introduction: 'Paging eliminates external fragmentation by partitioning physical memory into frames and logical memory into pages.',
        bodySections: [
          {
            heading: '1. Paging Hardware & Address Translation',
            points: [
              'Logical address consists of Page Number ($p$) and Page Offset ($d$).',
              'Page number is index into Page Table containing frame base address ($f$).',
              'Physical address = Frame Number ($f$) combined with Offset ($d$).'
            ]
          },
          {
            heading: '2. Translation Lookaside Buffer (TLB)',
            points: [
              'Associative high-speed cache storing recently accessed page-to-frame translations.',
              'On memory reference, CPU searches TLB simultaneously in 1 clock cycle.',
              '**TLB Hit:** Frame number extracted with zero memory access penalty.',
              '**TLB Miss:** Access standard page table in RAM, then update TLB.'
            ]
          },
          {
            heading: '3. Effective Access Time (EAT) Calculation',
            points: [
              'Let Hit Ratio = $\\alpha$, TLB Lookup Time = $\\epsilon$, Main Memory Access Time = $m$.',
              '$EAT = \\alpha \\times (\\epsilon + m) + (1 - \\alpha) \\times (\\epsilon + 2m)$.',
              'Example with 90% hit ratio: $EAT = 0.90 \\times (20 + 100) + 0.10 \\times (20 + 200) = 108 + 22 = 130\\text{ ns}$.'
            ]
          }
        ],
        conclusion: 'TLB dramatically bridges the gap between processor registers and RAM latencies in modern virtual memory operating systems.',
        diagramOrStructure: `[CPU Logical Address (p, d)] ---> [TLB Lookup] ---Hit---> [Physical Frame f] + [Offset d] ---> [Physical RAM]`
      }
    ],
    definitions: [
      {
        id: 'def-os-1',
        term: 'Thrashing',
        definition: 'A critical operating system state where the CPU spends excessive time swapping pages in and out of backing store rather than executing active instructions.',
        keyKeywords: ['Page Fault Rate', 'Working Set Model', 'CPU Utilization Drop', 'Swap Overload'],
        exampleOrFormula: 'Occurs when sum of process Working Sets exceeds total physical memory frames.',
        marks: 2
      },
      {
        id: 'def-os-2',
        term: 'Context Switch',
        definition: 'The operational mechanism of saving the state of the currently executing process in its PCB and loading the saved state of another process.',
        keyKeywords: ['PCB', 'State Save', 'CPU Registers', 'Kernel Overhead'],
        marks: 2
      },
      {
        id: 'def-os-3',
        term: 'Belady\'s Anomaly',
        definition: 'The counter-intuitive phenomenon where increasing the number of allocated physical page frames results in an increased number of page faults under FIFO replacement.',
        keyKeywords: ['FIFO Page Replacement', 'Page Fault Increase', 'Frame Allocation'],
        marks: 2
      }
    ],
    keyPoints: [
      {
        id: 'kp-os-1',
        topic: 'Process vs Thread',
        points: [
          'A process is an executing program with isolated address space, PCB, and open file descriptors.',
          'A thread is a lightweight unit of CPU utilization within a process sharing code, data, and OS resources with sibling threads.',
          'Context switching between threads is substantially faster than inter-process context switches.'
        ]
      }
    ],
    sampleQuestions: [
      {
        id: 'sq-os-1',
        question: 'Consider 3 processes with arrival times 0, 1, 2 and burst times 5, 3, 1. Calculate the average turnaround time using Shortest Remaining Time First (SRTF).',
        marks: 4,
        type: 'Numerical / Analytical',
        hintOrGuideline: 'Preempt the running process whenever a newly arrived process has a shorter remaining burst.',
        solution: 'Timeline: At t=0, P1 starts. At t=1, P2 arrives (burst 3 < remaining P1 4), P2 runs. At t=2, P3 arrives (burst 1 < remaining P2 2), P3 runs till t=3. P2 resumes till t=5. P1 finishes at t=9. Average Turnaround = (9 + 4 + 1) / 3 = 4.67 ms.'
      }
    ],
    questionPaper: {
      institution: 'EXAMFORGE AI UNIVERSITY MODEL EXAMINATION',
      examination: 'B.TECH DEGREE SEMESTER EXAMINATION',
      subject: 'CS202: OPERATING SYSTEMS ARCHITECTURE',
      timeAllowed: '3 Hours',
      maximumMarks: 50,
      instructions: [
        'Answer ALL questions from Section A (2 marks each).',
        'Answer any FOUR questions from Section B (5 marks each).',
        'Answer any TWO questions from Section C (10 marks each).',
        'Neat diagrams must be drawn wherever necessary.'
      ],
      sections: [
        {
          name: 'SECTION A',
          instruction: 'Answer ALL questions. Each question carries 2 marks.',
          totalMarks: 10,
          questions: [
            { questionNumber: 'Q1', text: 'Define Thrashing and describe its direct impact on overall CPU utilization.', marks: 2 },
            { questionNumber: 'Q2', text: 'What is a Context Switch? Why is context switching considered pure administrative overhead?', marks: 2 },
            { questionNumber: 'Q3', text: 'State Belady\'s Anomaly. Which page replacement algorithm exhibits this anomaly?', marks: 2 },
            { questionNumber: 'Q4', text: 'Differentiate between a binary semaphore and a counting semaphore.', marks: 2 },
            { questionNumber: 'Q5', text: 'Define internal fragmentation and contrast it with external fragmentation.', marks: 2 }
          ]
        },
        {
          name: 'SECTION B',
          instruction: 'Answer any FOUR questions. Each question carries 5 marks.',
          totalMarks: 20,
          questions: [
            { questionNumber: 'Q6', text: 'Explain the four necessary Coffman conditions required for a deadlock to occur in a multi-programming system.', marks: 5 },
            { questionNumber: 'Q7', text: 'Compare Preemptive and Non-Preemptive CPU scheduling algorithms with examples.', marks: 5 },
            { questionNumber: 'Q8', text: 'Explain the working of Demand Paging and outline the exact steps executed during a Page Fault trap.', marks: 5 },
            { questionNumber: 'Q9', text: 'Describe Peterson\'s algorithm for mutual exclusion in a two-process critical section problem.', marks: 5 },
            { questionNumber: 'Q10', text: 'Explain the Banker\'s Algorithm for deadlock avoidance with safety algorithm steps.', marks: 5 }
          ]
        },
        {
          name: 'SECTION C',
          instruction: 'Answer any TWO questions. Each question carries 10 marks.',
          totalMarks: 20,
          questions: [
            { questionNumber: 'Q11', text: 'Illustrate the hardware address translation scheme in Paging with Translation Lookaside Buffer (TLB). Calculate Effective Access Time for a 90% hit ratio.', marks: 10 },
            { questionNumber: 'Q12', text: 'Discuss the classic Readers-Writers synchronization problem. Provide a complete semaphore-based solution ensuring mutual exclusion.', marks: 10 },
            { questionNumber: 'Q13', text: 'Explain the various Page Replacement algorithms (FIFO, Optimal, LRU) with a reference string of your choice.', marks: 10 }
          ]
        }
      ]
    },
    answerKey: [
      {
        id: 'ak-os-1',
        questionNumber: 'Q1',
        sectionName: 'SECTION A',
        questionText: 'Define Thrashing and describe its direct impact on overall CPU utilization.',
        marks: 2,
        markingScheme: [
          { step: 'Definition of thrashing', marksAllocated: '1 Mark' },
          { step: 'Impact on CPU utilization', marksAllocated: '1 Mark' }
        ],
        modelAnswer: 'Thrashing is a condition in virtual memory systems where a process spends more time swapping pages into and out of backing store than executing user instructions. When high page fault rates occur, the operating system scheduler assumes low workload and introduces more processes, causing CPU utilization to plummet catastrophically.',
        bulletPoints: [
          'High page-fault frequency exceeds disk I/O throughput.',
          'CPU utilization drops towards near-zero.'
        ]
      },
      {
        id: 'ak-os-2',
        questionNumber: 'Q2',
        sectionName: 'SECTION A',
        questionText: 'What is a Context Switch? Why is context switching considered pure administrative overhead?',
        marks: 2,
        markingScheme: [
          { step: 'Context switch definition and PCB', marksAllocated: '1 Mark' },
          { step: 'Overhead justification', marksAllocated: '1 Mark' }
        ],
        modelAnswer: 'A context switch is the process of storing the CPU state and registers of the currently running process into its Process Control Block (PCB) and loading the state of a newly scheduled process. It is pure overhead because the system executes no productive user computation while switching context.',
        bulletPoints: [
          'Saves/restores program counters, registers, and memory mappings.',
          'Execution latency ranges from a few microseconds to milliseconds.'
        ]
      }
    ]
  };
}

export function generatePackLocally(file: UploadedFile, setup: PreparationSetup): ExamPreparationPack {
  return generateExamPackFromText(file.textContent || file.name, setup, file.name);
}
