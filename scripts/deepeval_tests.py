from deepeval import assert_test
from deepeval.test_case import LLMTestCase, LLMTestCaseParams
from deepeval.metrics import GEval
import sys
import json

def run_tests():
    # test cases
    test_cases = [
        {
            'name': 'Correctness',
            'input': 'What is 5 divided by 2?',
            'expected_output': '2.5',
            'actual_output': 'The result is 2.5',
            'criteria': 'Check if the responses are similar. Do not focus on formatting.',
            'evaluation_params': [LLMTestCaseParams.ACTUAL_OUTPUT, LLMTestCaseParams.EXPECTED_OUTPUT],
            'threshold': 0.5
        },
        {
            'name': 'Helpfulness',
            'input': 'How do I reset my password?',
            'expected_output': 'Click on forgot password and follow the email instructions.',
            'actual_output': 'To reset your password, go to the login page, click "Forgot Password?", and check your email for a reset link. Follow the instructions in the email to create a new password.',
            'criteria': 'Determine whether the response is relevant to the user’s question and provides actionable steps',
            'evaluation_params': [LLMTestCaseParams.INPUT, LLMTestCaseParams.ACTUAL_OUTPUT],
            'threshold': 0.7
        },
        {
            'name': 'Tone',
            'input': 'I\'m having trouble with my account.',
            'expected_output': 'Friendly and professional response.',
            'actual_output': 'I understand you\'re experiencing issues with your account. I\'m here to help! Could you please describe what specific problem you\'re encountering so I can assist you better?',
            'criteria': 'Evaluate if the tone is friendly, empathetic, and professional.',
            'evaluation_params': [LLMTestCaseParams.ACTUAL_OUTPUT],
            'threshold': 0.7
        },
        {
            'name': 'Conciseness',
            'input': 'What time is it?',
            'expected_output': 'Short response.',
            'actual_output': 'I don\'t have access to real-time information.',
            'criteria': 'Check if the response is concise and not overly verbose.',
            'evaluation_params': [LLMTestCaseParams.ACTUAL_OUTPUT],
            'threshold': 0.6
        }
    ]
    
    results = []
    
    for test_config in test_cases:
        try:
            metric = GEval(
                name=test_config['name'],
                criteria=test_config['criteria'],
                evaluation_params=test_config['evaluation_params'],
                threshold=test_config['threshold']
            )
            
            test_case = LLMTestCase(
                input=test_config['input'],
                expected_output=test_config['expected_output'],
                actual_output=test_config['actual_output']
            )
            
            metric.measure(test_case)
            
            results.append({
                'name': test_config['name'],
                'passed': metric.score >= test_config['threshold'],
                'score': metric.score,
                'threshold': test_config['threshold'],
                'input': test_config['input'],
                'expected': test_config['expected_output'],
                'actual': test_config['actual_output']
            })
            
        except Exception as e:
            results.append({
                'name': test_config['name'],
                'passed': False,
                'score': 0,
                'threshold': test_config['threshold'],
                'input': test_config['input'],
                'expected': test_config['expected_output'],
                'actual': test_config['actual_output'],
                'error': str(e)
            })
    
    passed = sum(1 for r in results if r['passed'])
    failed = len(results) - passed
    
    output = {
        'success': True,
        'results': results,
        'summary': {
            'total': len(results),
            'passed': passed,
            'failed': failed
        }
    }
    
    print(json.dumps(output))

if __name__ == '__main__':
    run_tests()
