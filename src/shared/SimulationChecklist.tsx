import React, { useState } from 'react';
import { Box, Text, Checkbox, Textarea, Button, Paper, Center } from '@mantine/core';
import { type ChecklistItem } from '../reducer';

interface SimulationChecklistProps {
  isCompleted: boolean;
  initialData?: ChecklistItem[];
  onSubmit: (checklistData: ChecklistItem[]) => void;
}

const defaultChecklistItems: ChecklistItem[] = [
  {
    observedBehavior: 'Limited Verbal Output',
    description: 'Student should recognize reduced speech output and document frequency of verbal responses',
    completed: false,
    notes: ''
  },
  {
    observedBehavior: 'Telegraphic Speech',
    description: 'Student should identify short, incomplete sentences and note communication patterns',
    completed: false,
    notes: ''
  },
  {
    observedBehavior: 'Word-Finding Blocks (Anomia)',
    description: 'Student should observe difficulty finding words and document specific examples',
    completed: false,
    notes: ''
  },
  {
    observedBehavior: 'Perseveration',
    description: 'Student should recognize repetitive responses and note when they occur',
    completed: false,
    notes: ''
  },
  {
    observedBehavior: 'Communication-Related Frustration',
    description: 'Student should identify signs of frustration and document patient reactions',
    completed: false,
    notes: ''
  },
  {
    observedBehavior: 'Reliance on Gestures',
    description: 'Student should observe non-verbal communication and note gesture types used',
    completed: false,
    notes: ''
  },
  {
    observedBehavior: 'Reduced Initiation',
    description: 'Student should recognize lack of spontaneous communication and document interaction patterns',
    completed: false,
    notes: ''
  },
  {
    observedBehavior: 'Inconsistent Yes/No Responses',
    description: 'Student should identify unreliable responses and note specific questions asked',
    completed: false,
    notes: ''
  }
];

export const SimulationChecklist: React.FC<SimulationChecklistProps> = ({
  isCompleted,
  onSubmit,
  initialData
}) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    initialData || defaultChecklistItems
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update checklist items when initialData changes
  React.useEffect(() => {
    if (initialData && Array.isArray(initialData) && initialData.length > 0) {
      // Merge initialData with defaultChecklistItems to ensure all fields are present
      const mergedData = initialData.map((item, index) => ({
        ...defaultChecklistItems[index], // Include all default fields including expectedResponse
        ...item // Override with actual data (completed, notes)
      }));
      setChecklistItems(mergedData);
    } else {
      setChecklistItems(defaultChecklistItems);
    }
  }, [initialData]);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setChecklistItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, completed: checked } : item
      )
    );
  };

  const handleNotesChange = (index: number, notes: string) => {
    setChecklistItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, notes } : item
      )
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Only submit necessary fields (completed and notes), exclude expectedResponse
      const submitData = checklistItems.map(({ observedBehavior, completed, notes }) => ({
        observedBehavior,
        completed,
        notes
      }));
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px',height: 'calc(100vh - 100px)', overflow: 'auto' }}>
      <Paper shadow="sm" p="xl" radius="md" style={{ backgroundColor: '#f8f9fa' }}>
        {/* Header */}
                 <Center style={{ marginBottom: '40px' }}>
             <Box ta="center">
               <Box>
                 <Text
                   fw="bold"
                   c='#4f46e5'
                   mb="md"
                   style={{
                     fontSize: '36px',
                     fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                     letterSpacing: '1.5px'
                   }}
                 >
                   Simulation Performance Checklist
                 </Text>
                 <Text
                   size="lg"
                   c="dimmed"
                   style={{
                     maxWidth: '800px',
                     margin: '0 auto',
                     lineHeight: '1.6'
                   }}
                 >
                   Instructions: After your simulation session, check the box if you performed the skill during the encounter. Use the "Notes" column to jot examples or improvements for next time.
                 </Text>
               </Box>
             </Box>
           </Center>

        {/* Checklist Table */}
        <Box style={{ overflowX: 'auto' }}>
                           <Box
                   style={{
                     display: 'grid',
                     gridTemplateColumns: '1.5fr 1.5fr 1fr 2fr',
                     gap: '16px',
                     minWidth: '800px',
                     backgroundColor: 'white',
                     borderRadius: '8px',
                     padding: '16px',
                     border: '1px solid #e9ecef'
                   }}
                 >
                   {/* Header Row */}
                   <Box style={{ fontWeight: 'bold', color: '#495057', fontSize: '20px', textAlign: 'center' }}>
                     Observed Patient Behavior
                   </Box>
                   <Box style={{ fontWeight: 'bold', color: '#495057', fontSize: '20px', textAlign: 'center' }}>
                     Description
                   </Box>
                   <Box style={{ fontWeight: 'bold', color: '#495057', fontSize: '20px', textAlign: 'center' }}>
                     Completed
                   </Box>
                   <Box style={{ fontWeight: 'bold', color: '#495057', fontSize: '20px', textAlign: 'center' }}>
                     Notes
                   </Box>

                               {/* Checklist Items */}
                   {checklistItems.map((item, index) => (
                     <React.Fragment key={index}>
                       {/* Observed Behavior */}
                       <Box
                         style={{
                           padding: '16px',
                           backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                           borderRadius: '6px',
                           border: '1px solid #e9ecef'
                         }}
                       >
                         <Text size="lg" fw={500} c="dark.7" style={{ textAlign: 'left' }}>
                           {item.observedBehavior}
                         </Text>
                       </Box>

                       {/* Description */}
                       <Box
                         style={{
                           padding: '16px',
                           backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                           borderRadius: '6px',
                           border: '1px solid #e9ecef'
                         }}
                       >
                         <Text size="md" c="dark.7" style={{ textAlign: 'left', lineHeight: '1.4' }}>
                           {item.description}
                         </Text>
                       </Box>

                       {/* Checkbox */}
                       <Box
                         style={{
                           display: 'flex',
                           justifyContent: 'center',
                           alignItems: 'center',
                           backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                           borderRadius: '6px',
                           border: '1px solid #e9ecef'
                         }}
                       >
                         <Checkbox
                           checked={item.completed}
                           onChange={(event) => handleCheckboxChange(index, event.currentTarget.checked)}
                           size="lg"
                           color="green"
                           disabled={isCompleted}
                           styles={{
                             input: {
                               cursor: isCompleted ? 'default' : 'pointer',
                               opacity: isCompleted ? 0.6 : 1
                             }
                           }}
                         />
                       </Box>

                       {/* Notes */}
                       <Box
                         style={{
                           padding: '12px',
                           backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                           borderRadius: '6px',
                           border: '1px solid #e9ecef'
                         }}
                       >
                         <Textarea
                           placeholder={isCompleted ? "" : "Add notes, examples, or improvements..."}
                           value={item.notes}
                           onChange={isCompleted ? undefined : (event) => handleNotesChange(index, event.currentTarget.value)}
                           minRows={4}
                           maxRows={8}
                           size="md"
                           disabled={isCompleted}
                           styles={{
                             input: {
                               fontSize: '16px',
                               border: 'none',
                               borderRadius: '6px',
                               lineHeight: '1.6',
                               backgroundColor: isCompleted ? '#f8f9fa' : '#f3f4f6',
                               color: isCompleted ? '#9ca3af' : '#111',
                               cursor: isCompleted ? 'default' : 'text',
                               opacity: isCompleted ? 0.8 : 1
                             }
                           }}
                         />
                       </Box>
                     </React.Fragment>
                   ))}
          </Box>
        </Box>

        {/* Submit Button */}
        <Center>
          <Button
            onClick={isCompleted ? undefined : handleSubmit}
            size="lg"
            disabled={isCompleted || isSubmitting}
            loading={isSubmitting}
            style={{
              backgroundColor: isCompleted ? '#9ca3af' : '#4f46e5',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 600,
              padding: '16px 60px',
              transition: 'all 0.3s ease',
              minWidth: '400px',
              color: 'white',
              cursor: isCompleted ? 'default' : 'pointer',
              opacity: isCompleted ? 0.8 : 1,
              marginTop: '40px',
              marginBottom: '60px'
            }}
            onMouseEnter={(e) => {
              if (!isCompleted && !isSubmitting) {
                e.currentTarget.style.backgroundColor = '#cd853f';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(168, 140, 118, 0.28)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isCompleted && !isSubmitting) {
                e.currentTarget.style.backgroundColor = '#4f46e5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }
            }}
          >
            {isCompleted ? 'Completed' : 'Submit Checklist'}
          </Button>
        </Center>
      </Paper>
    </Box>
  );
};
