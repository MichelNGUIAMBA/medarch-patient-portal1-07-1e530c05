
import { LabExam } from '@/types/labExam';

export const processExamData = (examData: LabExam) => {
  const requestedExams = [];
  
  const addExamsFromCategory = (category: string, subcategory: string, items: Record<string, boolean>) => {
    for (const [key, value] of Object.entries(items)) {
      if (value) {
        requestedExams.push({
          type: `${category}.${subcategory}.${key}`,
          status: 'pending'
        });
      }
    }
  };
  
  if (examData) {
    for (const [category, categoryData] of Object.entries(examData)) {
      if (typeof categoryData === 'object') {
        for (const [subcategory, items] of Object.entries(categoryData)) {
          if (typeof items === 'object') {
            addExamsFromCategory(category, subcategory, items as Record<string, boolean>);
          } else if (items) {
            requestedExams.push({
              type: `${category}.${subcategory}`,
              status: 'pending'
            });
          }
        }
      }
    }
  }
  
  return requestedExams;
};
